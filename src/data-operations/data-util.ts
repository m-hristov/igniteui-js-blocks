import { FilteringExpression, FilteringLogic } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringState, FilteringStateDefaults } from "./filtering-state.interface";
import { IFilteringStrategy, FilteringStrategy } from "./filtering-strategy";

import { SortingExpression, SortingDirection } from "./sorting-expression.interface";
import {SortingStateDefaults, SortingState} from "./sorting-state.interface";
import {SortingStrategy, ISortingStrategy} from "./sorting-strategy";

import {PagingState, PagingError} from "./paging-state.interface";

import {DataState} from "./data-state.interface";

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
                if (target[key] === undefined) {target[key] = defaults[key]; }
            });
        return target;
    }
    static getFilteringConditionsByDataType(dataType: "string" | "number" | "boolean" | "date"): Array<string> {
        var res = [],
            conditions = FilteringCondition[dataType];
        if (!conditions) {
            return res;
        }
        return Object.keys(conditions);
    }
    static sort<T> (data: T[], state: SortingState): T[] {
        if (!state) {
            return data;
        }
        // set defaults
        DataUtil.mergeDefaultProperties(state, SortingStateDefaults);
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
        if (index >= state.metadata.countPages) {
            state.metadata.error = PagingError.IncorrectPageIndex;
            return res;
        }
        return data.slice(index * recordsPerPage, (index + 1) * recordsPerPage);
    }
    static filter<T> (data: T[],
                    state: FilteringState): T[] {
        if (!state) {
            return data;
        }
        // set defaults
        DataUtil.mergeDefaultProperties(state, FilteringStateDefaults);
        return state.strategy.filter(data, state);
    }
    static process<T> (data: T[], state: DataState): T[] {
        if (!state) {
            return data;
        }
        var f:FilteringState, s: SortingState, p: PagingState;
        f = state.filtering;
        if (f && f.expressions && f.expressions.length) {
            data = DataUtil.filter(data, f);
        }
        s = state.sorting;
        if (s && s.expressions && s.expressions.length) {
            data = DataUtil.sort(data, s);
        }
        p = state.paging;
        if (p && p.recordsPerPage) {
            data = DataUtil.page(data, p);
        }
        return data;
    }
}

