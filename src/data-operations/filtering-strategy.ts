import { FilteringExpression, FilteringLogic, FilteringExpressionSettings } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringState } from "./filtering-state.interface";
import {DataUtil} from "./data-util";

export interface IFilteringStrategy {
    filter(data: any[], expressions: Array<FilteringExpression>, logic?: FilteringLogic): any[];
}

const expressionSettingsDefaults:FilteringExpressionSettings = {
    ignoreCase: true,
    dateFormat: "dMy"
}

export class FilteringStrategy implements IFilteringStrategy {
    constructor(public defaultExpressionSettings: FilteringExpressionSettings = expressionSettingsDefaults) {
    }
    private setDefaultSettings(expressions: Array<FilteringExpression>) {
        expressions.forEach((expr) => {
            expr.settings = expr.settings || {}; 
            DataUtil.mergeDefaultProperties(expr.settings, this.defaultExpressionSettings);
        });
    }
    filter<T>(data: T[],
                expressions: Array<FilteringExpression>, 
                logic?: FilteringLogic): T[] {
        var i, len = data.length,
            res: T[] = [],
            rec;
        if (!expressions || !expressions.length || !len) {
            return data;
        }
        this.setDefaultSettings(expressions);
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (this.findMatchByExpressions(rec, expressions, logic)) {
                res.push(rec);
            }
        }
        return res;
    }
    findMatchByExpressions(rec: Object,
                            expressions: Array<FilteringExpression>, 
                            logic?: FilteringLogic): Boolean {
        var i, len = expressions.length, match = false, 
            and = (logic === FilteringLogic.And);
        for (i = 0; i < len; i++) {
            match = this.findMatch(rec, expressions[i]);
            if (and) {
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