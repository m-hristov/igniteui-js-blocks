import { FilteringExpression, FilteringLogic } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringState, filteringStateDefaults } from "./filtering-state.interface";
import { IFilteringStrategy, FilteringStrategy } from "./filtering-strategy";

import { SortingExpression, SortingDirection } from "./sorting-expression.interface";
import {SortingStateDefaults, SortingState} from "./sorting-state.interface";
import {SortingStrategy, ISortingStrategy} from "./sorting-strategy";

import {PagingState, PagingError} from "./paging-state.interface";

import {DataState} from "./data-state.interface";

export enum DataType {
    String,
    Number,
    Boolean,
    Date
}

export class DataUtil {
    static mergeDefaultProperties(target: Object, defaults: Object) {
        if (!defaults) {
            return target;
        }
        if (!target) {
            target = Object.assign({}, defaults);
            return target;
        }
        Object
            .keys(defaults)
            .forEach(function(key) { 
                if (target[key] === undefined && defaults[key] !== undefined) {
                    target[key] = defaults[key];
                }
            });
        return target;
    }
    static getFilteringConditionsForDataType(dataType: DataType): {[name: string]: Function} {
        var dt:string;
        switch(dataType) {
            case DataType.String:
                dt = "string";
            break;
            case DataType.Number:
                dt = "number";
            break;
            case DataType.Boolean:
                dt = "boolean";
            break;
            case DataType.Date:
                dt = "date";
            break;
        }
        return FilteringCondition[dt];
    }
    static getListOfFilteringConditionsForDataType(dataType: DataType): Array<string> {
        return Object.keys(DataUtil.getFilteringConditionsForDataType(dataType));
    }
    static sort<T> (data: T[], state: SortingState): T[] {
        // set defaults
        DataUtil.mergeDefaultProperties(state, SortingStateDefaults);
        // apply default settings for each sorting expression(if not set)
        return state.strategy.sort(data, state.expressions);
    }
    static page<T> (data: T[], state: PagingState): T[] {
        if (!state) {
            return data;
        }
        var len = data.length,
            index = state.index,
            res = [],
            recordsPerPage = state.recordsPerPage;
        state.metadata = {
            countPages: 0,
            error: PagingError.None,
            countRecords: data.length
        };
        if (index < 0 || isNaN(index)) {
            state.metadata.error = PagingError.IncorrectPageIndex;
            return res;
        }
        if (recordsPerPage <= 0 || isNaN(recordsPerPage)) {
            state.metadata.error = PagingError.IncorrectRecordsPerPage;
            return res;
        }
        state.metadata.countPages = Math.ceil(len / recordsPerPage);
        if (!len) {
            return data;
        }
        if (index >= state.metadata.countPages) {
            state.metadata.error = PagingError.IncorrectPageIndex;
            return res;
        }
        return data.slice(index * recordsPerPage, (index + 1) * recordsPerPage);
    }
    static filter<T> (data: T[],
                    state: FilteringState): T[] {
        // set defaults
        DataUtil.mergeDefaultProperties(state, filteringStateDefaults);
        if (!state.strategy) {
            return data;
        }
        return state.strategy.filter(data, state.expressions, state.logic);
    }
    static process<T> (data: T[], state: DataState): T[] {
        if (!state) {
            return data;
        }
        if (state.filtering) {
            data = DataUtil.filter(data, state.filtering);
        }
        if (state.sorting) {
            data = DataUtil.sort(data, state.sorting);
        }
        if (state.paging) {
            data = DataUtil.page(data, state.paging);
        }
        return data;
    }
}