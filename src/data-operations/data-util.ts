import { FilteringExpression } from "./filtering-expression.interface";
import { FilteringOperators } from "./filtering-operators";
import { FilteringSettings } from "./filtering-settings.interface";
import { SortingExpression } from "./sorting-expression.interface";
import { PagingData } from "./paging-data.interface";
import { ColumnDefinition } from "./column-definition.interface";

export class DataUtil {
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
    static filter<T> (data: T[], expressions: FilteringExpression[], settings?: FilteringSettings): T[] {
        var i, len = data.length, 
            res: T[] = [], 
            rec;
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (DataUtil.findMatchByExpressions(rec, expressions, settings)) {
                res.push(rec);
            }
        }
        return res;
    }
    static process<T> (data: T[], settings: {
                                    filtering?: {
                                        expressions?: FilteringExpression[], settings?: FilteringSettings
                                    },
                                    sorting?: {
                                        expressions?: SortingExpression[], ignoreCase?: boolean
                                    }
                                    paging?: {pageIndex: number, pageSize: number}
                                }
            ): T[] {
        var f, s, p;
        if (!settings) {
            return data;
        }
        f = settings.filtering;
        if (f && f.expressions && f.expressions.length) {
            data = DataUtil.filter(data, f.expressions, f.settings);
        }
        s = settings.sorting;
        if (s && s.expressions && s.expressions.length) {
            data = DataUtil.sort(data, s.expressions, s.ignoreCase);
        }
        p = settings.paging;
        if (p) {
            data = DataUtil.page(data, p.pageIndex, p.pageSize).pageData;
        }
        return data;
    }
    private static transform<T>(
                data: T[],
                schema: Array<ColumnDefinition>,
                clone: boolean = false): Array<any> {
        if (!data || !schema || !schema.length) {
            return data;
        }
        var i, len = data.length, res = [], trec;
        for (i = 0; i < len; i++) {
            trec = DataUtil.transformRecord(data[i], schema, clone);
            if (clone) {
                res.push(trec);
            } else {
                data[i] = trec;
            }
        }
        return clone ? res : data;
    }
    /* HELPER FUNCTIONS */
    /* SORTING/GROUP-BY */
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
    /* //SORTING/GROUP-BY */

    /* SCHEMA TRANSFORM */
    static transformRecord<T>(record: T,
                                    schema: Array<ColumnDefinition>,
                                    clone: boolean = false) {
        var i, len = schema.length, trec = clone? {} : record, fn;
        for (i = 0; i < len; i++) {
            fn = schema[i].fieldName;
            trec[fn] = DataUtil.convertType(record[fn], schema[i].type, record);
        }
        return trec;
    }
    static convertType<T>(val, type: "string"|"number"|"date"|"boolean"|"any", record: T) {
        if (!type || type === "any") {
            return val;
        }
        if (type === "string") {
            return val === null || val === undefined ? "" : val + "";
        }
        if (type === "number") {
            return val === null || val === undefined ? null : +val;
        }
        if (type === "boolean") {
            return !!val;
        }
        if (type === "date") {
            if (typeof val === "" || val === null || val === undefined) {
                return null;
            }
            if (Object.prototype.toString.call(val) === '[object Date]') {
                if (isNaN(val.getTime())) {
                    return null;
                }
                return val;
            }
            return new Date(val);
        }
        return val;
    }
    static getType (o): string {
		var t = typeof o;
		if (t === "undefined" || t === "string") {
			return "string";
		} else if (o && o.getTime && !isNaN(o.getTime()) &&
			Object.prototype.toString.call(o) === "[object Date]") {
			return "date";
		} else if (t === "boolean" || t === "number" || t === "object") {
			return t;
		}
        return "string";
	}
    /* //SCHEMA TRANSFORM */

    /* FILTERING */
    private static findMatchByExpressions(rec: Object, expressions: FilteringExpression[], settings?: FilteringSettings): Boolean {
        settings = settings || {};
        var i, len = expressions.length, match = false, boolLogic = settings.boolLogic || "and";
        for (i = 0; i < len; i++) {
            match = DataUtil.findMatch(rec, expressions[i], settings.ignoreCase);
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
        var t, fo = FilteringOperators, res;
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
    static findMatch(rec: Object, expr: FilteringExpression, ignoreCase?: boolean): boolean {
        var op = expr.resolvedOperator || expr.operator,
            key = expr.fieldName,
            val = rec[key],
            fo = op;
        if (typeof op === "string") {
            fo = DataUtil.findOperatorByName(op, expr);
            expr.resolvedOperator = fo; // if next time tries to find operator with the same name do NOT call 'findOperatorByName' -> use 'resolvedOperator'.
        }
        if (fo && typeof fo === "function") {
            return fo(val, expr, ignoreCase, rec);
        }
        throw new Error("Filtering operator is not implemented");
    }
    /* //FILTERING */
}