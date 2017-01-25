import {FilteringSettings} from "./filtering-settings.interface";
import {SortingExpression} from "./sorting-expression.interface";
import {FilteringExpression} from "./filtering-expression.interface";
import {GroupByExpression} from "./groupby-expression.interface";
import {FilteringOperators} from "./filtering-operators";
import {PagingData} from "./paging-data.interface";
import {DataUtil} from "./data-util";

/**
 * 
 */
const DATASOURCE_IGNORE_CASE: boolean = true;
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
            common?: FilteringSettings
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
            applied?: boolean;
        },
        paging?: {
            res: PagingData,
            applied: boolean
        }
    } = {
        filtering: {
            data: [],
            applied: false
        },
        sorting: {
            applied: false
        },
        paging: null
    };
    
    pagingData: PagingData;
    filteringData: {
        countFilteredRecords: number; 
        filteredData: any[]
    };
    resetSettings(): void {
        this.settings = {
            filtering: {
                common: {
                    boolLogic: 'and',
                    ignoreCase: DATASOURCE_IGNORE_CASE
                }
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
        this.resetSettings();
        if (total !== undefined && total !== null) {
            this.total = total;
        } else {
            this.total = (this.data && this.data.length) || 0;
        }
    }
    resetResultData(): void {
        // reset filtering result data
        this.resultData.filtering.data = [];
        this.resultData.filtering.applied = false;
        // reset sorting result data
        this.resultData.sorting.applied = false;
        // reset paging result data
        this.resultData.paging = null;
    }
    dataBind(): DataSource {
        var ignoreCase: boolean, s = this.settings;
        s = s || {};
        this.resetResultData();
        this.dataView = this.data;
        // apply data operations
        // apply filtering
        if (s.filtering && s.filtering.expressions && s.filtering.expressions.length) {
            this.filter(s.filtering.expressions, s.filtering.common);
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
    getRecordIndex (record: Object, data?: any[]): number {
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
        var len = data.length, i, res = null;
        for (i = 0; i < len; i++) {
            if (data[i][fieldName] === value) {
                return {
                    index: i,
                    record: data[i]
                };
            }
        }
        return null;
    }
    sort (expressions: SortingExpression[], ignoreCase: boolean = true, data?: any[]): DataSource {
        data = data || this.dataView;
        var res = DataUtil.sort(data, expressions, ignoreCase);
        this.dataView = res;
        this.resultData = this.resultData || {};
        this.resultData.sorting = {
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
            res: res
        };
        return this;
    }
    // CRUD operations
    addRecord (record: Object, at?: number): DataSource {
        if (at === null || at === undefined) {
            this.data.push(record);
        }
        this.data.splice(at, 0, record);
        return this;
    }
    deleteRecord(record: Object): DataSource {
        var index:number = this.data.indexOf(record);
        return this.deleteRecordByIndex(index);
    }
    deleteRecordByIndex(index: number): DataSource {
        if (index < 0 || index >= this.data.length || !this.data[index]) {
            return this;
        }
        this.data.splice(index, 1);
        return this;
    }
    updateRecordByIndex(index: number, record: Object): DataSource {
        if (!this.data[index]) {
            return;
        }
        this.data[index] = record;
        return this;
    }
}