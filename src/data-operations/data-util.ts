import { FilteringExpression, BoolLogic } from "./filtering-expression.interface";
import { FilteringCondition } from "./filtering-condition";
import { FilteringSettings } from "./filtering-settings.interface";
import { IFilteringStrategy, FilteringStrategy } from "./filtering-strategy";
import { SortingExpression, SortingDirection } from "./sorting-expression.interface";
import { PagingData } from "./paging-data.interface";
import { ColumnDefinition } from "./column-definition.interface";
import {SortingStrategy} from "./sorting-strategy";
import {ISortingStrategy} from "./sorting-strategy.interface";

export class DataUtil {
    static sort<T> (data: T[], expressions: SortingExpression[], strategy: ISortingStrategy = new SortingStrategy()): T[] {
        return strategy.sort(data, expressions);
    }
    static page<T> (data: T[], pageIndex: number, pageSize: number): PagingData {
        var len = data.length, 
            res: PagingData = {
                err: null,
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
            res.err = "pageSize should be positive number";
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
    static filter<T> (data: T[], 
                    expressions: FilteringExpression[], 
                    settings?: FilteringSettings,
                    strategy: IFilteringStrategy = new FilteringStrategy()): T[] {
        return strategy.filter(data, expressions, settings);
    }
    static process<T> (data: T[], settings: {
                                    filtering?: {
                                        expressions?: FilteringExpression[], settings?: FilteringSettings
                                    },
                                    sorting?: {
                                        expressions?: SortingExpression[]
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
            data = DataUtil.sort(data, s.expressions);
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
        if (!data || !data.length || !schema || !schema.length) {
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
    /* SCHEMA TRANSFORM */
    static transformRecord<T>(record: T,
                                    schema: Array<ColumnDefinition>,
                                    clone: boolean = false) {
        var i, len = schema.length, trec = clone? {} : record, fn;
        for (i = 0; i < len; i++) {
            fn = schema[i].fieldName;
            trec[fn] = DataUtil.transformField(record[fn], schema[i].type);
        }
        return trec;
    }
    static transformField<T>(val, type: "string"|"number"|"date"|"boolean"|"any") {
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

}

