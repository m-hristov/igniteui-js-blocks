import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";

import { TestHelper} from "./test-util/test-helper.spec";
import {FilteringCondition} from "./filtering-condition";
describe('Unit testing FilteringCondition', () => {
    it("tests string conditions", () => {
        var fc = FilteringCondition.string;
        // contains
        expect(fc.contains("test123", "esT"))
            .toBeFalsy("contains ignoreCase: false");
        expect(fc.contains("test123", "esT", {ignoreCase: true}))
            .toBeTruthy("contains ignoreCase: true");
        // does not contain
        expect(fc.doesNotContain("test123", "esT"))
            .toBeTruthy("doesNotContain ignoreCase: false");
        expect(fc.doesNotContain("test123", "esT", {ignoreCase: true}))
            .toBeFalsy("doesNotContain ignoreCase: true");
        // startsWith
        expect(fc.startsWith("test123", "TesT"))
            .toBeFalsy("startsWith ignoreCase: false");
        expect(fc.startsWith("test123", "TesT", {ignoreCase: true}))
            .toBeTruthy("startsWith ignoreCase: true");
        // endsWith
        expect(fc.endsWith("test123", "T123"))
            .toBeFalsy("endsWith ignoreCase: false");
        expect(fc.endsWith("test123", "sT123", {ignoreCase: true}))
            .toBeTruthy("endsWith ignoreCase: true");
        // equals
        expect(fc.equals("test123", "Test123"))
            .toBeFalsy();
        expect(fc.equals("test123", "Test123", {ignoreCase: true}))
            .toBeTruthy();
        // doesNotEqual
        expect(fc.doesNotEqual("test123", "Test123"))
            .toBeTruthy("doesNotEqual ignoreCase: false");
        expect(fc.doesNotEqual("test123", "Test123", {ignoreCase: true}))
            .toBeFalsy("doesNotEqual ignoreCase: true");
        // empty
        expect(!fc.empty("test") && fc.empty(null) && fc.empty(undefined))
            .toBeTruthy("empty");
        // notEmpty
        expect(fc.notEmpty("test") && !fc.notEmpty(null) && !fc.notEmpty(undefined))
            .toBeTruthy("notEmpty");
        // null
        expect(!fc.null("test") && fc.null(null) && !fc.null(undefined))
            .toBeTruthy("null");
        // notNull
        expect(fc.notNull("test") && !fc.notNull(null) && fc.notNull(undefined))
            .toBeTruthy("notNull");
    });
    it("tests number conditions", () => {
        var fn = FilteringCondition.number;
        expect(fn.doesNotEqual(1, 2))
            .toBeTruthy("doesNotEqual");
        expect(fn.empty(null))
            .toBeTruthy("empty");
        expect(fn.equals(1, 1))
            .toBeTruthy("equals");
        expect(fn.greaterThan(2, 1))
            .toBeTruthy("greaterThan");
        expect(fn.greaterThanOrEqualTo(2, 1))
            .toBeTruthy("greaterThanOrEqualTo(2, 1)");
        expect(fn.greaterThanOrEqualTo(2, 2))
            .toBeTruthy("greaterThanOrEqualTo(2, 2)");
        expect(fn.lessThan(1, 2))
            .toBeTruthy("lessThan(1, 2)");
        expect(fn.lessThan(2, 2))
            .toBeFalsy("lessThan(2, 2)");
        expect(fn.lessThanOrEqualTo(1, 2))
            .toBeTruthy("lessThanOrEqualTo(1, 2)");
        expect(fn.lessThanOrEqualTo(2, 2))
            .toBeTruthy("lessThanOrEqualTo(2, 2)");
        expect(fn.notEmpty(1))
            .toBeTruthy("notEmpty");
        expect(fn.empty(null))
            .toBeTruthy("empty");
        expect(fn.notNull(1))
            .toBeTruthy("notNull");
        expect(fn.null(null))
            .toBeTruthy("null");
    });
    it("tests date conditions", () => {
        var fd = FilteringCondition.date,
            now = new Date(),
            cnow = new Date(),
            yesterday = ( d => new Date(d.setDate(d.getDate() - 1)) )(new Date),
            lastMonth = ( d => new Date(d.setMonth(d.getMonth() - 1)) )(new Date),
            nextMonth = ( d => new Date(d.setMonth(d.getMonth() + 1)) )(new Date),
            lastYear = ( d => new Date(d.setFullYear(d.getFullYear() - 1)) )(new Date),
            nextYear = ( d => new Date(d.setFullYear(d.getFullYear() + 1)) )(new Date);
        expect(fd.after(now, yesterday) && !fd.after(now, nextYear))
            .toBeTruthy("after");
        expect(fd.before(yesterday, now) && !fd.before(now, lastYear))
            .toBeTruthy("before");
        expect(fd.doesNotEqual(now, yesterday) && fd.doesNotEqual(now, yesterday, {dateFormat: "dMy"}))
            .toBeTruthy("doesNotEqual");
        expect(fd.empty(null) && fd.empty(undefined) && !fd.empty(now))
            .toBeTruthy("empty");
        expect(!fd.notEmpty(null) && !fd.notEmpty(undefined) && fd.notEmpty(now))
            .toBeTruthy("notEmpty");
        expect(fd.equals(now, cnow, {dateFormat: "dMy"}) && !fd.equals(now, yesterday, {dateFormat: "dMy"}))
            .toBeTruthy("equals");
        expect(!fd.lastMonth(now) && fd.lastMonth(lastMonth))
            .toBeTruthy("lastMonth");
        expect(fd.lastYear(lastYear) && !fd.lastYear(now))
            .toBeTruthy("lastYear");
        expect(!fd.nextMonth(now) && fd.nextMonth(nextMonth))
            .toBeTruthy("nextMonth");
        expect(!fd.nextYear(now) && fd.nextYear(nextYear))
            .toBeTruthy("nextYear");
        expect(fd.notEmpty(now) && !fd.notEmpty(null) && !fd.notEmpty(undefined))
            .toBeTruthy("notEmpty");
        expect(fd.notNull(now) && !fd.notNull(null) && fd.notNull(undefined))
            .toBeTruthy("notNull");
        expect(fd.null(null) && !fd.null(now) && !fd.null(undefined))
            .toBeTruthy("null");
        expect(fd.thisMonth(now) && !fd.thisMonth(nextYear))
            .toBeTruthy("thisMonth");
        expect(fd.thisYear(now) && !fd.thisYear(nextYear))
            .toBeTruthy("thisYear");
        expect(fd.today(now) && !fd.today(nextYear))
            .toBeTruthy("today");
        expect(!fd.yesterday(now) && fd.yesterday(yesterday))
            .toBeTruthy("yesterday");
    });
    it("tests boolean conditions", () => {
        var f = FilteringCondition.boolean;
        expect(f.empty(null) && f.empty(undefined) && !f.empty(false))
            .toBeTruthy("empty");
        expect(f.false(false) && !f.false(true))
            .toBeTruthy("false");
        expect(!f.true(false) && f.true(true))
            .toBeTruthy("true");
        expect(!f.notEmpty(null) && !f.notEmpty(undefined) && f.notEmpty(false))
            .toBeTruthy("notEmpty");
        expect(f.null(null) && !f.null(undefined) && !f.null(false))
            .toBeTruthy("null");
        expect(!f.notNull(null) && f.notNull(undefined) && f.notNull(false))
            .toBeTruthy("notNull");
    });
});
