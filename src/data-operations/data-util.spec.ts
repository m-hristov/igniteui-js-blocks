import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DataUtil, DataSource, FilteringOperators, FilteringSettings, PagingData, SortingExpression } from "../main";

describe('Unit testing DataUtil', () => {
    var data;
    const COLS_COUNT = 4;
    const ROWS_COUNT = 5;

    beforeEach(async(() => {
        data = createData(ROWS_COUNT, COLS_COUNT);
    }));
    describe('test sort', () => {
        it('sorts descending column "number"', () => {
            var i, res, err = null,
                se = <SortingExpression> {
                fieldName: "number",
                dir: "desc"
            };
            res = DataUtil.sort(data, [se]);
            for (i = 0; i < ROWS_COUNT; i++) {
                if (res[i].number !== ROWS_COUNT - i - 1) {
                    err = `Sorting is not properly applied for record with index ${i}`;
                    break;
                }
            }
            expect(res.length === ROWS_COUNT && err === null).toBeTruthy();
        });
        it('sorts ascending column "boolean"', () => {
            var i, res, err = null, setTrue = 0, setFalse = 0,
                se = <SortingExpression> {
                fieldName: "boolean",
                dir: "asc"
            };
            res = DataUtil.sort(data, [se]);
            for (i = 0; i < ROWS_COUNT; i++) {
                if (res[i].boolean) {
                    setTrue++;
                } else {
                    setFalse++;
                }
            }
            expect(res.length === ROWS_COUNT && setTrue === 2 && setFalse === 3).toBeTruthy();
        });
        // test multiple sorting
        it('sorts descending column "boolean", sorts "datetime" ascending', () => {
            var i, res, err = null, setTrue = 0, setFalse = 0, err,
                map = [1, 3, 0, 2, 4],
                se0 = <SortingExpression> {
                    fieldName: "boolean",
                    dir: "desc"
                },
                se1 = <SortingExpression> {
                    fieldName: "datetime",
                    dir: "asc"
                };
            res = DataUtil.sort(data, [se0, se1]);
            for (i = 0; i < ROWS_COUNT; i++) {
                if (res[i].number !== map[i]) {
                    err = true;
                    break;
                }
            }
            expect(res.length === ROWS_COUNT && !err).toBeTruthy();
        });
        // test custom sorting
        it ('sorts using custom sorting function', () => {
            var i, err, res, se0 = <SortingExpression> {
                    fieldName: "number",
                    dir: "desc",
                    compareFunc: (a, b) => {
                        var aE = !(a % 2),
                            bE = !(b % 2);
                        if ((aE && bE) || (!aE && !bE)) {
                            return a > b ? 1 : (a < b) ? -1: 0;
                        }
                        if (aE) {
                            return 1;
                        }
                        // b is even
                        return -1;
                    }
                },  map = [1, 3, 0, 2, 4];
            res = DataUtil.sort(data, [se0]);
            for (i = 0; i < ROWS_COUNT; i++) {
                if (res[i].number !== map[i]) {
                    err = true;
                    break;
                }
            }
            expect(res.length === ROWS_COUNT && !err).toBeTruthy();
        });
    });
});

/* helper functions */

function generateColumns(countCols) {
    var i:number,
        len: number,
        res,
        defaultColumns = [
        {
            name: "number",
            type: "number"
        },
        {
            name: "string",
            type: "string"
        },
        {
            name: "datetime",
            type: "datetime"
        },
        {
            name: "boolean",
            type: "boolean"
        }
    ]
    if (countCols <= 0) {
        return defaultColumns;
    }
    if (countCols <= defaultColumns.length) {
        return defaultColumns.slice(0, countCols);
    }
    len = countCols - defaultColumns.length;
    res = defaultColumns;
    for (i =0; i < len; i++) {
        res.push({
            name: `col${i}`,
            type: "string"
        })
    }
}

function createData(countRows: number, countCols: number) {
    var i, j, data = [], rec, val, col, cols = generateColumns(countCols);
    for (i = 0; i < countRows; i++) {
        rec = {};
        for (j = 0; j < cols.length; j++) {
            col = cols[j];
            switch(col.type) {
                case "number":
                    val = i;
                    break;
                case "datetime":
                    val = new Date((new Date()).setDate(i));
                    break;
                case "boolean":
                    val = !!(i % 2);
                    break;
                default:
                    val = `row${i}, col${j}`;
                    break;
            }
            rec[col.name] = val;
        }
        data.push(rec);
    }
    return data;
};

