import {FilterSettings, DataUtil} from "./data-util";
import {SortingExpression} from "./sorting-expression.interface";
import {FilteringExpression} from "./filtering-expression.interface";
import {GroupByExpression} from "./groupby-expression.interface";
import {FilterOperators} from "./filter-operators";
import {PagingData} from "./paging-data.interface";
/**
 * Represents the result of the [`process`]({% slug api_kendo-data-query_process_kendouiforangular%}) method applied to a data structure.
 */
export class DataSource {
    /**
     * The data to be rendered by the Grid as an array.
     */
    data: any[];
    /**
     * The total number of records that is available.
     */
    total: number;
    dataView: any[];
    pagingData: PagingData;
    filteringData;
    constructor (data: any[] = [], total?: number) {
        this.data = data;
        this.dataView = data;
        if (total !== undefined && total !== null) {
            this.total = total;
        } else {
            this.total = (this.data && this.data.length) || 0;
        }
    }
    getRecordByIndex (index: number, data?: any[]) {
        if (index < 0) {
            return null;
        }
        data = data || this.dataView;
        return data[index] || null;
    }
    getRecordByKeyValue (fieldName: string, value: any, data?: any[]) {
        data = data || this.data;
        var len = data.length, i;
        for (i = 0; i < len; i++) {
            if (data[i][fieldName] === value) {
                return data[i];
            }
        }
        return null;
    }
    sort (expressions: SortingExpression[], ignoreCase: boolean = true, data?: any[]): DataSource{
        data = data || this.dataView;
        this.dataView = DataUtil.sort(data, expressions, ignoreCase);
        return this;
    }
    filter (expressions: FilteringExpression[], filterSettings?: FilterSettings, data?: any[]): DataSource {
        data = data || this.data;
        this.dataView = DataUtil.filter(data, expressions, filterSettings);
        return this;
    }
    page(pageIndex: number, pageSize: number, data?: any[]): DataSource {
        data = data || this.dataView;
        this.pagingData = DataUtil.page(data, pageIndex, pageSize);
        this.dataView = this.pagingData.pageData;
        return this;
    }
}
