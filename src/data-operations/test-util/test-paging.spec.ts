import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DataUtil, PagingState, PagingError } from "../../main";
import {TestHelper} from "./test-helper.spec";

export function TestPaging() {
    var helper:TestHelper = new TestHelper(),
        data:Object[] = helper.generateData();
    
    describe('test paging', () => {
        it('paginates data', () => {
            var state: PagingState = {index: 0, recordsPerPage: 3},
                res = DataUtil.page(data, state);
            expect(state.metadata.error).toBe(PagingError.None);
            expect(state.metadata.countPages).toBe(2);
            expect(helper.getValuesForColumn(res, "number"))
                .toEqual([0, 1, 2]);
            // go to second page
            state = {index: 1, recordsPerPage: 3};
            res = DataUtil.page(data, state);
            expect(state.metadata.error).toBe(PagingError.None);
            expect(state.metadata.countPages).toBe(2);
            expect(helper.getValuesForColumn(res, "number"))
                .toEqual([3, 4]);
        });
        it('tests paging errors', () => {
            var state: PagingState = {index: -1, recordsPerPage: 3},
                res = DataUtil.page(data, state);
            expect(state.metadata.error).toBe(PagingError.IncorrectPageIndex);
            state = {index: 3, recordsPerPage: 3},
            res = DataUtil.page(data, state);
            expect(state.metadata.error).toBe(PagingError.IncorrectPageIndex);
            state = {index: 3, recordsPerPage: 0},
            res = DataUtil.page(data, state);
            expect(state.metadata.error).toBe(PagingError.IncorrectRecordsPerPage);
        });
    });
}