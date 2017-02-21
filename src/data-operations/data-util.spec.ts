import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import {TestSorting} from "./test-util/test-sorting.spec";
import { TestFiltering} from "./test-util/test-filtering.spec";
import { TestPaging } from "./test-util/test-paging.spec";
import { TestHelper} from "./test-util/test-helper.spec";

import {DataState} from "./data-state.interface";
import {FilteringCondition} from "./filtering-condition";
import {SortingExpression, SortingDirection} from "./sorting-expression.interface";
import {DataUtil} from "./data-util";
import {PagingError, PagingState} from "./paging-state.interface";

describe('Unit testing DataUtil', () => {
    TestSorting();
    TestFiltering();
    TestPaging();
    // test process
    describe('test process', () => {
        it('calls process as applies filtering, sorting, paging', () => {
            var metadata,
                state:DataState = {
                    filtering: {
                        expressions: [{
                            fieldName: "number", 
                            condition: FilteringCondition.number.greaterThan, 
                            searchVal: 1}]
                    },
                    sorting: {
                            expressions: [
                                {
                                    fieldName: "number",
                                    dir: SortingDirection.Desc
                                }
                            ]
                        },
                    paging: {
                        index: 1,
                        recordsPerPage: 2
                    }
                }, 
                helper:TestHelper = new TestHelper(),
                data:Object[] = helper.generateData(), 
                result = DataUtil.process(data, state);
            expect(helper.getValuesForColumn(result, "number"))
                    .toEqual([2]);
            metadata = state.paging.metadata;
            expect(metadata.countPages === 2 && metadata.error === PagingError.None)
                .toBeTruthy();
        });
    });
});
