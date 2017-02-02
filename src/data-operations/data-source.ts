import { FilteringExpression } from "./filtering-expression.interface";
import { FilteringOperators } from "./filtering-operators";
import { FilteringSettings } from "./filtering-settings.interface";
import { SortingExpression } from "./sorting-expression.interface";
import { PagingData } from "./paging-data.interface";
import { ColumnDefinition } from "./column-definition.interface";
import {DataUtil} from "./data-util";

/**
 * 
 */
const DATASOURCE_IGNORE_CASE: boolean = true;
/**
 * 
 */
export class DataSource {
    /**
     * 
     */
    data: any[];
    /**
     *
     * The total number of records that is available.
     */
    total: number;
    /**
     * processed data
     */
    dataView: any[];

    // settings
    settings: {
        filtering?: {
            expressions?: Array<FilteringExpression>,
            boolLogic?: "and"|"or";
            ignoreCase?: boolean;
        },
        sorting?: {
            expressions?: Array<SortingExpression>,
            ignoreCase?: boolean
        },
        paging?: {
            disabled?: boolean,
            pageIndex: number,
            pageSize: number
        }
    };
    resultData: {
        filtering?: {
            data: any[];
            applied: boolean;
        },
        sorting?: {
            data: any[],
            applied?: boolean;
        },
        paging?: {
            data: any[],
            applied: boolean,
            pagingInfo: PagingData
        }
    } = {
        filtering: {
            data: [],
            applied: false
        },
        sorting: {
            data: [],
            applied: false
        },
        paging: null
    };
    initSettings(): void {
        this.settings = {
            filtering: {
                boolLogic: 'and',
                ignoreCase: DATASOURCE_IGNORE_CASE
            },
            sorting: {
                ignoreCase: DATASOURCE_IGNORE_CASE
            }, 
            paging: null
        };
    }
    constructor (data: any[] = [], total?: number) {
        this.data = data;
        this.dataView = data;
        this.initSettings();
        if (total !== undefined && total !== null) {
            this.total = total;
        } else {
            this.total = (this.data && this.data.length) || 0;
        }
    }
    private resetResultData(): void {
        // reset filtering result data
        this.resultData.filtering.data = [];
        this.resultData.filtering.applied = false;
        // reset sorting result data
        this.resultData.sorting.applied = false;
        // reset paging result data
        this.resultData.paging = null;
    }
    dataBind(): DataSource {
        var ignoreCase: boolean, s = this.settings || {};
        this.resetResultData();
        this.dataView = this.data;
        // apply data operations
        // apply filtering
        if (s.filtering && s.filtering.expressions && s.filtering.expressions.length) {
            this.filter(s.filtering.expressions, 
                        <FilteringSettings> {boolLogic: s.filtering.boolLogic, ignoreCase: s.filtering.ignoreCase});
        }
        // apply sorting
        if (s.sorting && s.sorting.expressions && s.sorting.expressions.length) {
            this.sort(s.sorting.expressions, s.sorting.ignoreCase);
        }
        // apply paging
        if (s.paging && !s.paging.disabled) {
            this.page(s.paging.pageIndex, s.paging.pageSize);
        }
        return this;
    }
    getIndexOfRecord (record: Object, data?: any[]): number {
        data = data || this.data;
        return data.indexOf(record);
    }
    getRecordByIndex (index: number, data?: any[]) {
        if (index < 0) {
            return null;
        }
        data = data || this.data;
        return data[index] || null;
    }
    getRecordInfoByKeyValue (fieldName: string, value: any, data?: any[]): {index: number, record: Object} {
        data = data || this.data;
        var len = data.length, i, res = {index: -1, record: null};
        for (i = 0; i < len; i++) {
            if (data[i][fieldName] === value) {
                return {
                    index: i,
                    record: data[i]
                };
            }
        }
        return res;
    }
    // basic data operations
    sort (expressions: SortingExpression[], ignoreCase: boolean = true, data?: any[]): DataSource {
        data = data || this.dataView;
        var res = DataUtil.sort(data, expressions, ignoreCase);
        this.dataView = res;
        this.resultData = this.resultData || {};
        this.resultData.sorting = {
            data: res,
            applied: true
        };
        return this;
    }
    filter (expressions: FilteringExpression[], settings?: FilteringSettings, data?: any[]): DataSource {
        var res;
        data = data || this.data;
        res = DataUtil.filter(data, expressions, settings);
        this.resultData = this.resultData || {};
        this.resultData.filtering = {
            data: res,
            applied: true
        };
        this.dataView = res;
        return this;
    }
    page(pageIndex: number, pageSize: number, data?: any[]): DataSource {
        data = data || this.dataView;
        var res:PagingData = DataUtil.page(data, pageIndex, pageSize);
        this.dataView = res.pageData;
        this.resultData = this.resultData || {};
        this.resultData.paging = {
            applied: true,
            data: res.pageData,
            pagingInfo: res
        };
        return this;
    }
    // CRUD operations
    addRecord (record: Object, at?: number, data?: any[]): DataSource {
        data = data || this.data;
        if (at === null || at === undefined) {
            data.push(record);
            return this;
        }
        data.splice(at, 0, record);
        return this;
    }
    deleteRecord(record: Object, data?: any[]): DataSource {
        data = data || this.data;
        var index:number = data.indexOf(record);
        return this.deleteRecordByIndex(index, data);
    }
    deleteRecordByIndex(index: number, data?: any[]): DataSource {
        data = data || this.data;
        if (!data || index < 0 || index >= data.length || !data[index]) {
            return this;
        }
        data.splice(index, 1);
        return this;
    }
    updateRecordByIndex(index: number, record: Object, data?: any[]): DataSource {
        data = data || this.data;
        if (!data[index]) {
            return this;
        }
        data[index] = record;
        return this;
    }
}