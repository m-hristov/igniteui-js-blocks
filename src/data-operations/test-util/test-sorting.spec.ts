import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DataUtil, SortingState, SortingExpression, SortingDirection } from "../../main";
import {TestHelper} from "./test-helper.spec";

const COUNT_ROWS = 5;
const COUNT_COLS = 4;

export function TestSorting() {
    var data:Array<any> = [],
        helper:TestHelper = new TestHelper();
    beforeEach(async(() => {
        data = helper.generateData(COUNT_ROWS, COUNT_COLS);
    }));
    describe('test sorting', () => {
        it('sorts descending column "number"', () => {
            var se = <SortingExpression> {
                    fieldName: "number",
                    dir: SortingDirection.Desc
                },
                res = DataUtil.sort(data, {expressions: [se]});
            expect(helper.getValuesForColumn(res, "number"))
                .toEqual(helper.generateArray(4, 0));
        });
        it('sorts ascending column "boolean"', () => {
            var se = <SortingExpression> {
                    fieldName: "boolean",
                    dir: SortingDirection.Asc
                },
                res = DataUtil.sort(data, {expressions: [se]});
            expect(helper.getValuesForColumn(res, "boolean"))
                .toEqual([false, false, false, true, true]);
        });
        // test multiple sorting
        it('sorts descending column "boolean", sorts "date" ascending', () => {
            var se0 = <SortingExpression> {
                    fieldName: "boolean",
                    dir: SortingDirection.Desc
                },
                se1 = <SortingExpression> {
                    fieldName: "date",
                    dir: SortingDirection.Asc
                },
                res = DataUtil.sort(data, {expressions: [se0, se1]});
            expect(helper.getValuesForColumn(res, "number"))
                .toEqual([1, 3, 0, 2, 4]);
        });
        // test custom sorting
        it ('sorts using custom sorting function', () => {
            var key = "number",
                se0:SortingExpression = {
                    fieldName: key,
                    dir: SortingDirection.Asc,
                    // sorting descending
                    compareFunction: function (obj1, obj2) {
                        var a = obj1[key], b = obj2[key];
                        return b - a;
                    }
                },
            res = DataUtil.sort(data, {expressions: [se0]});
            expect(helper.getValuesForColumn(res, "number"))
                .toEqual(helper.generateArray(4, 0));
        });
    });
}