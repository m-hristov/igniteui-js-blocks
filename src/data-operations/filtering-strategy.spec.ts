import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { TestHelper} from "./test-util/test-helper.spec";

import { FilteringStrategy, FilteringCondition, FilteringLogic, FilteringExpression, FilteringState } from "../main";

describe("Unit testing filtering strategy", () => {
    var helper:TestHelper,
        data:Object[],
        fs: FilteringStrategy;
    beforeEach(() => {
        helper = new TestHelper();
        data = helper.generateData();
        fs = new FilteringStrategy();
    });
    it ("tests `filter`", () => {
        var res = fs.filter(data, [{
                fieldName: "number", 
                condition: FilteringCondition.number.greaterThan,
                searchVal: 1
            }]);
        expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([2, 3, 4]);
    });
    it ("tests `findMatchByExpressions`", () => {
        var rec = data[0],
            res = fs.findMatchByExpressions(rec, 
                            [
                                {
                                    fieldName: "string",
                                    condition: FilteringCondition.string.contains,
                                    searchVal: "ROW",
                                    settings: {
                                        ignoreCase: false
                                    }
                                },
                                {
                                    fieldName: "number",
                                    condition: FilteringCondition.number.lessThan,
                                    searchVal: 1
                                }
                            ],
                            FilteringLogic.Or);
        expect(res).toBeTruthy();
    });
    it ("tests `findMatch`", () => {
        var rec = data[0],
            res = fs.findMatch(rec, {
                    fieldName: "boolean",
                    condition: FilteringCondition.boolean.false});
            expect(res).toBeTruthy();
    });
    it ("tests default settings", () => {
        data[0]["string"] = "ROW"
        var fs = new FilteringStrategy({ignoreCase: false}),
            res = fs.filter(data, [{
                                    fieldName: "string",
                                    condition: FilteringCondition.string.contains,
                                    searchVal: "ROW"
                                }]);
        expect(helper.getValuesForColumn(res, "number"))
                    .toEqual([0]);
    });
});