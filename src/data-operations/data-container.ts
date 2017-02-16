import { FilteringExpression, FilteringLogic } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringState } from "./filtering-state.interface";
import { IFilteringStrategy, FilteringStrategy } from "./filtering-strategy";

import { SortingExpression, SortingDirection } from "./sorting-expression.interface";
import {SortingState} from "./sorting-state.interface";
import {ISortingStrategy, SortingStrategy} from "./sorting-strategy";

import {PagingState, PagingError} from "./paging-state.interface";

import {DataState} from "./data-state.interface";
import {DataUtil} from "./data-util";

/**
 * 
 */
export class DataContainer {
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
    transformedData: any[];

    // settings
    state: DataState = {
    };
    constructor (data: any[] = [], total?: number) {
        this.data = data;
        this.transformedData = data;
        if (total !== undefined && total !== null) {
            this.total = total;
        }
    }
    reset(state?: DataState): DataContainer {
        this.state = state || {};
        this.transformedData = this.data;
        return this;
    }
    process(state?: DataState): DataContainer {
        if (state) {
            this.state = state;
        }
        this.transformedData = this.data;
        // apply data operations
        this.transformedData = DataUtil.process(this.data, this.state);
        return this;
    }
    // access data records
    getIndexOfRecord (record: Object, data?: any[]): number {
        data = data || this.data || [];
        return data.indexOf(record);
    }
    getRecordByIndex (index: number, data?: any[]) {
        if (index < 0) {
            return null;
        }
        data = data || this.data || [];
        return data[index] || null;
    }
    getRecordInfoByKeyValue (fieldName: string, value: any, data?: any[]): {index: number, record: Object} {
        data = data || this.data || [];
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
    /*
    sort (sortingState: SortingState): DataContainer {
        this.state = this.state || {};
        this.state.sorting = sortingState;
        this.transformedData = DataUtil.sort(this.transformedData, this.state.sorting);
        return this;
    }
    filter (filteringState: FilteringState): DataContainer {
        this.state = this.state || {};
        this.state.filtering = filteringState;
        this.transformedData = DataUtil.filter(this.transformedData, this.state.filtering);
        return this;
    }
    page(pagingState: PagingState): DataContainer {
        this.state = this.state || {};
        this.state.paging = pagingState;
        this.transformedData = DataUtil.page(this.transformedData, this.state.paging);
        return this;
    }
    */
    // CRUD operations
    addRecord (record: Object, at?: number, data?: any[]): DataContainer {
        data = data || this.data;
        if (at === null || at === undefined) {
            data.push(record);
            return this;
        }
        data.splice(at, 0, record);
        return this;
    }
    deleteRecord(record: Object, data?: any[]): DataContainer {
        data = data || this.data;
        var index:number = data.indexOf(record);
        return this.deleteRecordByIndex(index, data);
    }
    deleteRecordByIndex(index: number, data?: any[]): DataContainer {
        data = data || this.data;
        if (!data || index < 0 || index >= data.length || !data[index]) {
            return this;
        }
        data.splice(index, 1);
        return this;
    }
    updateRecordByIndex(index: number, record: Object, data?: any[]): DataContainer {
        data = data || this.data;
        if (!data[index]) {
            return this;
        }
        data[index] = record;
        return this;
    }
}