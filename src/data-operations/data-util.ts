import {SortingExpression} from "./sorting-expression.interface";
import {FilteringExpression} from "./filtering-expression.interface";
import {GroupByExpression} from "./groupby-expression.interface";
import {FilterOperators} from "./filter-operators";
import { PagingData } from "./paging-data.interface";

export interface FilterSettings {
    boolLogic?: "and"|"or";
    ignoreCase?: boolean;
}

export class DataUtil {
    static groupedRecordsByExpression<T> (data: T[], index: number, expression: SortingExpression, ignoreCase?: boolean): T[] {
        var i, res = [], cmpRes, groupval,
            cmpFunc = expression.compareFunc,
            key = expression.fieldName,
            len = data.length;
        if (!cmpFunc) {
            cmpFunc = function (val1, val2): boolean {
                return val1 === val2;
            };
        }
        res.push(data[ index ]);
        groupval = data[ index ][ key ];
        index++;
        for (i = index; i < len; i++) {
            if (cmpFunc(data[ i ][ key ], groupval)) {
                res.push(data[ i ]);
            } else {
                break;
            }
        }
        return res;
    }
    static compareValues<T> (x, y) {
        if ((x === null || x === undefined) && (y === null || y === undefined)) {
            return 0;
        }
        if ((x === null || x === undefined) && y !== null && y !== undefined) {
            return -1;
        }
        if (x !== null && x !== undefined && (y === null || y === undefined)) {
            return 1;
        }
        return x > y ? 1 : x < y ? -1 : 0;
    }
    static sortByFieldExpression<T> (data: T[], expression: SortingExpression, ignoreCase?: boolean): T[] {
        var arr = [], sortF,
            key = expression.fieldName,
            applyIngoreCase = ignoreCase ? data[0] && typeof data[0][key] === "string": false,
            compareFunc = expression.compareFunc || DataUtil.compareValues,
            rec, val;
        sortF = function (reverse) {
            reverse = reverse ? -1 : 1;
            return function (obj1, obj2) {
                var a = obj1[key], b = obj2[key], arr1, arr2;
                    if (applyIngoreCase) {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                    }
                    arr1 = reverse * compareFunc(a, b);
                    arr2 = reverse * compareFunc(b, a);
                if (arr1 < arr2) {
                    return -1;
                }
                if (arr1 > arr2) {
                    return 1;
                }
                return 0;
            };
        };
        return data.sort(sortF(expression.dir === "desc"));
    }
    static sortDataRecursive<T> (data: T[], expressions: SortingExpression[], expressionIndex?: number, ignoreCase?: boolean): T[] {
        var i, j, dataLen = data.length, expr, gbExpr, gbData, gbDataLen,
            exprsLen = expressions.length;
        expressionIndex = expressionIndex || 0;
        if (expressionIndex >= exprsLen || dataLen <= 1) {
            return data;
        }
        expr = expressions[ expressionIndex ];
        data = DataUtil.sortByFieldExpression(data, expr, ignoreCase);
        if (expressionIndex === exprsLen - 1) {
            return data;
        }
        for (i = 0; i < dataLen; i++) {
            gbData = DataUtil.groupedRecordsByExpression(data, i, expr);
            gbDataLen = gbData.length;
            if (gbDataLen > 1) {
                gbData = DataUtil.sortDataRecursive(gbData, expressions, expressionIndex + 1, ignoreCase);
            }
            for (j = 0; j < gbDataLen; j++) {
                data[ i + j ] = gbData[ j ];
            }
            i += gbDataLen - 1;
        }
        return data;
    }
    static sort<T> (data: T[], expressions: SortingExpression[], 
                    ignoreCase: boolean = true): T[] {
        if (!expressions || data.length <= 1) {
            return data;
        }
        return DataUtil.sortDataRecursive(data, expressions, null, ignoreCase);
    }
    static page<T> (data: T[], pageIndex: number, pageSize: number): PagingData {//{ data: T[], pageCount: number}
        var len = data.length, 
            res: PagingData = {
                err: null,
                data: data,
                pageData: [],
                pageCount: 0,
                total: len,
                pageSize: pageSize,
                pageIndex: pageIndex
            };
        if (pageIndex < 0 || isNaN(pageIndex)) {
            res.err = "pageIndex should be number and should be greater than or equal to 0";
            return res;
        }
        if (pageSize <= 0 || isNaN(pageSize)) {
            res.err = "pageSize should be number and should be greater than 0";
            return res;
        }
        res.pageCount = Math.ceil(len / pageSize);
        if (pageIndex >= res.pageCount) {
            res.err = `pageIndex is greater or equal to pageCount: ${res.pageCount}`;
            return res;
        }
        res.pageData = data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
        return res;
    }
    static filter<T> (data: T[], expressions: FilteringExpression[], filterSettings?: {boolLogic?: "and"|"or", ignoreCase?: boolean}): T[] {
        var i, len = data.length, 
            res: T[] = [], 
            rec;
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (DataUtil.findMatchByExpressions(rec, expressions, filterSettings)) {
                res.push(rec);
            }
        }
        return res;
    }
    private static findMatchByExpressions(rec: Object, expressions: FilteringExpression[], filterSettings): Boolean {
        filterSettings = filterSettings || {};
        var i, len = expressions.length, match = false, boolLogic = filterSettings.boolLogic || "and";
        for (i = 0; i < len; i++) {
            match = DataUtil.findMatch(rec, expressions[i], filterSettings.ignoreCase);
            if (boolLogic === "and") {
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
    private static findOperatorByName(operator: string, expr?: FilteringExpression): Function {
        var t, fo = FilterOperators, res;
        if (expr && expr.type && fo[expr.type]) {
            return fo[expr.type][operator];
        }
        for (t in fo) {
            if (fo.hasOwnProperty(t)) {
                if (fo[t][operator]) {
                    return fo[t][operator]
                }
            }
        }
        return null;
    }
    private static findMatch(rec: Object, expr: FilteringExpression, ignoreCase?: boolean): boolean {
        var op = expr.operator,
            key = expr.fieldName,
            val = rec[key],
            fo = op;
        if (typeof op === "string") {
            fo = DataUtil.findOperatorByName(op, expr);
            expr.resolvedOperator = fo;
        }
        if (typeof fo === "function") {
            return fo(val, expr, ignoreCase, rec);
        }
        throw new Error("Filtering operator is not implemented");
    }
    // static groupby<T> (data: T[], expressions: GroupByExpression[]): T[] {
    //     return data;
    // }
}