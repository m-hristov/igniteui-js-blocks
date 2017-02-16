import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DataUtil, FilteringStrategy, FilteringCondition, FilteringExpression, FilteringState } from "../../main";
import {TestHelper} from "./test-helper.spec";


class CustomFilteringStrategy extends FilteringStrategy {
    filter<T>(data: T[], state: FilteringState): T[] {
        var i, len = Math.ceil(data.length / 2),
            exprs = state.expressions,
            res: T[] = [], 
            rec;
        if (!exprs || !exprs.length || !len) {
            return data;
        }
        for (i = 0; i < len; i++) {
            rec = data[i];
            if (this.findMatchByExpressions(rec, state)) {
                res.push(rec);
            }
        }
        return res;
    }
}

export function TestFiltering() {
    var helper:TestHelper = new TestHelper(),
        data:Object[] = helper.generateData();
    describe('test filtering', () => {
        it('filters "number" column greater than 3', () => {
            var res = DataUtil.filter(data, {
                                        expressions:[{fieldName: "number", condition: FilteringCondition.number.greaterThan, searchVal: 3}]
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([4]);
        });
        // test string filtering - with ignoreCase true/false
        it('filters "string" column contains "row"', () => {
            var res = DataUtil.filter(data, {
                                        expressions:[
                                                {
                                                    fieldName: "string", 
                                                    condition: FilteringCondition.string.contains, 
                                                    searchVal: "row", ignoreCase: true
                                                }]
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual(helper.getValuesForColumn(data, "number"));
            res[0]["string"] = "ROW";
            // case-sensitive
            res = DataUtil.filter(res, {
                                        expressions:[
                                                {
                                                    fieldName: "string", 
                                                    condition: FilteringCondition.string.contains, 
                                                    searchVal: "ROW"
                                                }]
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([0]);
        });
        // test date
        it("filters 'date' column", () => {
            var res = DataUtil.filter(data, {
                                        expressions:[
                                                {
                                                    fieldName: "date", 
                                                    condition: FilteringCondition.date.after, 
                                                    searchVal: new Date()
                                                }]
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([1,2,3,4]);
        });
        it("filters 'bool' column", () => {
             var res = DataUtil.filter(data, {
                                        expressions:[
                                                {
                                                    fieldName: "boolean", 
                                                    condition: FilteringCondition.boolean.false
                                                }]
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([0, 2, 4]);
        });
        it("filters using custom filtering strategy", () => {
            var res = DataUtil.filter(data, {
                                        expressions:[
                                                {
                                                    fieldName: "boolean", 
                                                    condition: FilteringCondition.boolean.false
                                                }],
                                        strategy: new CustomFilteringStrategy()
                                    });
            expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([0, 2]);
        })
    });
}