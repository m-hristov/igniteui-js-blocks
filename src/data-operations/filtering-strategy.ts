import { FilteringExpression, FilteringLogic, FilteringSettings } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringState } from "./filtering-state.interface";
import {DataUtil} from "./data-util";

export interface IFilteringStrategy {
    filter(data: any[], filteringState: FilteringState): any[];
}

export class FilteringStrategy implements IFilteringStrategy {
    settings: FilteringSettings = {
        ignoreCase: true,
        dateFormat: "dMy"
    }
    filter<T>(data: T[], filteringState: FilteringState): T[] {
        var i, len = data.length,
            res: T[] = [],
            exprs = filteringState.expressions,
            rec;
        if (!exprs || !exprs.length || !len) {
            return data;
        }
        exprs.forEach((expr) => {
            expr.settings = expr.settings || {}; 
            DataUtil.mergeDefaultProperties(expr.settings, this.settings);
        });
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (this.findMatchByExpressions(rec, filteringState)) {
                res.push(rec);
            }
        }
        return res;
    }
    findMatchByExpressions(rec: Object, filteringState: FilteringState): Boolean {
        var i, exprs = filteringState.expressions, len = exprs.length, match = false, 
            conjunction = (filteringState.logic === FilteringLogic.And);
        for (i = 0; i < len; i++) {
            match = this.findMatch(rec, exprs[i]);
            if (conjunction) {
                if (!match) {
                    return false;
                }
            } else {
                if (match) {
                    return true;
                }
            }
        }
        return match;
    }
    findMatch(rec: Object, expr: FilteringExpression): boolean {
        var cond = expr.condition,
            key = expr.fieldName,
            val = rec[key];
        return cond(val, expr.searchVal, expr.settings, rec);
    }
}