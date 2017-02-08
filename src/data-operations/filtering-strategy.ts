import { FilteringExpression, BoolLogic } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringSettings } from "./filtering-settings.interface";

export interface IFilteringStrategy {
    filter(data: any[], expressions: FilteringExpression[], settings?: FilteringSettings): any[];
}

export class FilteringStrategy implements IFilteringStrategy {
    filter<T>(data: T[], expressions: FilteringExpression[], settings?: FilteringSettings): T[] {
        var i, len = data.length, 
            res: T[] = [], 
            rec;
        if (!expressions || !expressions.length || !len) {
            return data;
        }
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (this.findMatchByExpressions(rec, expressions, settings)) {
                res.push(rec);
            }
        }
        return res;
    }
    findMatchByExpressions(rec: Object, expressions: FilteringExpression[], settings?: FilteringSettings): Boolean {
        settings = settings || {};
        var i, len = expressions.length, match = false, boolLogic = settings.boolLogic || BoolLogic.and;
        for (i = 0; i < len; i++) {
            match = this.findMatch(rec, expressions[i], settings.ignoreCase);
            if (boolLogic === BoolLogic.and) {
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
    findMatch(rec: Object, expr: FilteringExpression, ignoreCase?: boolean): boolean {
        var cond = expr.condition,
            key = expr.fieldName,
            val = rec[key];
        if (typeof cond === "function") {
            return cond(val, expr, ignoreCase, rec);
        }
        throw new Error("FilteringCondition should be of type function");
    }
}