import {FilteringExpression} from "./filtering-expression.interface";

export class FilteringOperators {
    static applyIgnoreCase (a: string, ignore) : string {
        if (a === null || a === undefined) {
            return "";
        }
        a = "" + a;
        return ignore? a.toLowerCase() : a;
    }
    static getDateParts(date: Date, dateFormat?: string): 
                        {   year?: number, 
                            month?: number, 
                            day?: number, 
                            hours?: number, 
                            minutes?: number, 
                            seconds?: number, 
                            milliseconds?: number
                        } {
        let res = {
            year: null, 
            month: null, 
            day: null, 
            hours: null, 
            minutes: null, 
            seconds: null, 
            milliseconds: null
        };
        if (!date || !dateFormat) {
            return res;
        }
        if (dateFormat.indexOf("y") >= 0) {
            res.year = date.getFullYear();
        }
        if (dateFormat.indexOf("M") >= 0) {
            res.month = date.getMonth();
        }
        if (dateFormat.indexOf("d") >= 0) {
            res.day = date.getDate();
        }
        if (dateFormat.indexOf("h") >= 0) {
            res.hours = date.getHours();
        }
        if (dateFormat.indexOf("m") >= 0) {
            res.minutes = date.getMinutes();
        }
        if (dateFormat.indexOf("s") >= 0) {
            res.seconds = date.getSeconds();
        }
        if (dateFormat.indexOf("f") >= 0) {
            res.milliseconds = date.getMilliseconds();
        }
        return res;
    }
    static string = {
        contains: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val.indexOf(search) !== -1;
        },
        startsWith: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val.startsWith(search);
        },
        endsWith: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val.endsWith(search);
        },
        doesNotContain: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val.indexOf(search) === -1;
        },
        equals: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val === search;
        },
        doesNotEqual: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            var val = FilteringOperators.applyIgnoreCase(val, ignore), 
                search = FilteringOperators.applyIgnoreCase(expr.searchVal, ignore);
            return val !== search;
        },
        null: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            return val === null;
        },
        notNull: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean
        {
            return val !== null;
        },
        empty: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean 
        {
            return val === null || val === undefined || val.length === 0;
        },
        notEmpty: function (val: string, expr: FilteringExpression, ignore?: boolean) : boolean 
        {
            return val !== null && val !== undefined && val.length > 0;
        }
    }
    static number = {
        equals: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) === Number(expr.searchVal);
        },
        doesNotEqual: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) !== Number(expr.searchVal);
        },
        greaterThan: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) > Number(expr.searchVal);
        },
        lessThan: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) < Number(expr.searchVal);
        },
        greaterThanOrEqualTo: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) >= Number(expr.searchVal);
        },
        lessThanOrEqualTo: function (val: number, expr: FilteringExpression) : boolean
        {
            return Number(val) <= Number(expr.searchVal);
        },
        null: function (val: number, expr: FilteringExpression) : boolean
        {
            return val === null;
        },
        notNull: function (val: number, expr: FilteringExpression) : boolean
        {
            return val !== null;
        },
        empty: function (val: number, expr: FilteringExpression) : boolean
        {
            return val === null || val === undefined || isNaN(val);
        },
        notEmpty: function (val: number, expr: FilteringExpression) : boolean
        {
            return val !== null && val !== undefined && !isNaN(val);
        }
    }
    static boolean = {
        true: function (val: boolean, expr: FilteringExpression) : boolean {
            return val;
        },
        false: function (val: boolean, expr: FilteringExpression) : boolean {
            return !val;
        },
        null: function (val: boolean, expr: FilteringExpression) : boolean {
            return val === null;
        },
        notNull: function (val: boolean, expr: FilteringExpression) : boolean {
            return val !== null;
        },
        empty: function (val: boolean, expr: FilteringExpression) : boolean {
            return val === null || val === undefined;
        },
        notEmpty: function (val: boolean, expr: FilteringExpression) : boolean {
            return val !== null && val !== undefined;
        }
    }
    static date = {
        equals: function (val: Date, expr: FilteringExpression) : boolean {
            return val === expr.searchVal;
        },
        doesNotEqual: function (val: Date, expr: FilteringExpression) : boolean {
            return val !== expr.searchVal;
        },
        before: function (val: Date, expr: FilteringExpression) : boolean {
            return val < expr.searchVal;
        },
        after: function (val: Date, expr: FilteringExpression) : boolean {
            return val > expr.searchVal;
        },
        today: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "yMd"), 
                now = FilteringOperators.getDateParts(new Date(), "yMd");
            return  d.year === now.year &&
                    d.month === now.month &&
                    d.day === now.day;
        },
        yesterday: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "yMd"), 
                y = ( d => new Date(d.setDate(d.getDate() - 1)) )(new Date),
                yesterday = FilteringOperators.getDateParts(y, "yMd");
            return  d.year === yesterday.year &&
                    d.month === yesterday.month &&
                    d.day === yesterday.day;
        },
        thisMonth: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "yM"), 
                now = FilteringOperators.getDateParts(new Date(), "yM");
            return  d.year === now.year &&
                    d.month === now.month;
        },
        lastMonth: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "yM"), 
                now = FilteringOperators.getDateParts(new Date(), "yM");
            if (!now.month) {
                now.month -= 1;
                now.year -= 1;
            }
            return  d.year === now.year &&
                    d.month === now.month;
        },
        nextMonth: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "yM"), 
                now = FilteringOperators.getDateParts(new Date(), "yM");
            if (now.month === 11) {
                now.month = 0;
                now.year += 1;
            }
            return  d.year === now.year &&
                    d.month === now.month;
        },
        thisYear: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "y"), 
                now = FilteringOperators.getDateParts(new Date(), "y");
            return  d.year === now.year;
        },
        lastYear: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "y"), 
                now = FilteringOperators.getDateParts(new Date(), "y");
            return  d.year === now.year - 1;
        },
        nextYear: function (val: Date, expr: FilteringExpression) : boolean {
            var d = FilteringOperators.getDateParts(val, "y"), 
                now = FilteringOperators.getDateParts(new Date(), "y");
            return  d.year === now.year + 1;
        },
        on: function (val: Date, expr: FilteringExpression) : boolean {
            var match = true,
                d = FilteringOperators.getDateParts(val, expr.dateFormat), 
                search = FilteringOperators.getDateParts(expr.searchVal, expr.dateFormat);
            if (!expr.dateFormat) {
                return val === expr.searchVal;
            }
            if (d.year !== null) {
                match = match && (d.year === search.year);
            }
            if (d.month !== null) {
                match = match && (d.month === search.month);
            }
            if (d.day !== null) {
                match = match && (d.day === search.day);
            }
            if (d.hours !== null) {
                match = match && (d.hours === search.hours);
            }
            if (d.minutes !== null) {
                match = match && (d.minutes === search.minutes);
            }
            if (d.seconds !== null) {
                match = match && (d.seconds === search.seconds);
            }
            if (d.milliseconds !== null) {
                match = match && (d.milliseconds === search.milliseconds);
            }
            return match;
        },
        notOn: function (val: Date, expr: FilteringExpression) : boolean {
            return !FilteringOperators.date.on(val, expr);
        },
        null: function (val: Date, expr: FilteringExpression) : boolean {
            return val === null;
        },
        notNull: function (val: Date, expr: FilteringExpression) : boolean {
            return val !== null;
        },
        empty: function (val: Date, expr: FilteringExpression) : boolean {
            return val === null || val === undefined;
        },
        notEmpty: function (val: Date, expr: FilteringExpression) : boolean {
            return val !== null && val !== undefined;
        }
    }
}