import {FilteringSettings} from "./filtering-expression.interface";
// helper functions
function applyIgnoreCase (a: string, ignoreCase: boolean) : string {
    a = a || "";
    return ignoreCase? a.toLowerCase() : a;
}

function getDateParts(date: Date, dateFormat?: string): 
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
export const FilteringCondition = {
    string: {
        contains: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase);
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target.indexOf(search) !== -1;
        },
        startsWith: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase);
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target.startsWith(search);
        },
        endsWith: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase);
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target.endsWith(search);
        },
        doesNotContain: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase), 
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target.indexOf(search) === -1;
        },
        equals: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase);
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target === search;
        },
        doesNotEqual: function (target: string, search: string, fs: FilteringSettings = {}) : boolean
        {
            target = applyIgnoreCase(target, fs.ignoreCase);
            search = applyIgnoreCase(search, fs.ignoreCase);
            return target !== search;
        },
        null: function (target: string) : boolean
        {
            return target === null;
        },
        notNull: function (target: string) : boolean
        {
            return target !== null;
        },
        empty: function (target: string) : boolean
        {
            return target === null || target === undefined || target.length === 0;
        },
        notEmpty: function (target: string) : boolean
        {
            return target !== null && target !== undefined && target.length > 0;
        }
    },
    number: {
        equals: function (target: number, search: number) : boolean
        {
            return target === search;
        },
        doesNotEqual: function (target: number, search: number) : boolean
        {
            return target !== search;
        },
        greaterThan: function (target: number, search: number) : boolean
        {
            return target > search;
        },
        lessThan: function (target: number, search: number) : boolean
        {
            return target < search;
        },
        greaterThanOrEqualTo: function (target: number, search: number) : boolean
        {
            return target >= search;
        },
        lessThanOrEqualTo: function (target: number, search: number) : boolean
        {
            return target <= search;
        },
        null: function (target: number) : boolean
        {
            return target === null;
        },
        notNull: function (target) : boolean
        {
            return target !== null;
        },
        empty: function (target: number) : boolean
        {
            return target === null || target === undefined || isNaN(target);
        },
        notEmpty: function (target: number) : boolean
        {
            return target !== null && target !== undefined && !isNaN(target);
        }
    },
    boolean: {
        true: function (target: boolean) : boolean {
            return target;
        },
        false: function (target: boolean) : boolean {
            return !target;
        },
        null: function (target: boolean) : boolean {
            return target === null;
        },
        notNull: function (target: boolean) : boolean {
            return target !== null;
        },
        empty: function (target: boolean) : boolean {
            return target === null || target === undefined;
        },
        notEmpty: function (target: boolean) : boolean {
            return target !== null && target !== undefined;
        }
    },
    date: {
        equals: function (target: Date, search: Date, fs: FilteringSettings = {}) : boolean {
            if (!target || !search || !fs.dateFormat) {
                return target === search;
            }
            var dpTarget = getDateParts(target, fs.dateFormat),
                dpSearch = getDateParts(search, fs.dateFormat), 
                res = true, prop;
            for (prop in dpTarget) {
                if (dpTarget.hasOwnProperty(prop) && typeof(dpTarget[prop]) === "number") {
                    if (dpTarget[prop] !== dpSearch[prop]) {
                        res = false;
                        break;
                    }
                }
            }
            return res;
        },
        doesNotEqual: function (target: Date, search: Date, fs: FilteringSettings = {}) : boolean {
            return !FilteringCondition.date.equals(target, search, fs);
        },
        before: function (target: Date, search: Date) : boolean {
            return target < search;
        },
        after: function (target: Date, search: Date) : boolean {
            return target > search;
        },
        today: function (target: Date) : boolean {
            var d = getDateParts(target, "yMd"), 
                now = getDateParts(new Date(), "yMd");
            return  d.year === now.year &&
                    d.month === now.month &&
                    d.day === now.day;
        },
        yesterday: function (target: Date) : boolean {
            var td = getDateParts(target, "yMd"), 
                y = ( d => new Date(d.setDate(d.getDate() - 1)) )(new Date),
                yesterday = getDateParts(y, "yMd");
            return  td.year === yesterday.year &&
                    td.month === yesterday.month &&
                    td.day === yesterday.day;
        },
        thisMonth: function (target: Date) : boolean {
            var d = getDateParts(target, "yM"), 
                now = getDateParts(new Date(), "yM");
            return  d.year === now.year &&
                    d.month === now.month;
        },
        lastMonth: function (target: Date) : boolean {
            var d = getDateParts(target, "yM"), 
                now = getDateParts(new Date(), "yM");
            if (!now.month) {
                now.month = 11;
                now.year -= 1;
            } else {
                now.month--;
            }
            return  d.year === now.year &&
                    d.month === now.month;
        },
        nextMonth: function (target: Date) : boolean {
            var d = getDateParts(target, "yM"), 
                now = getDateParts(new Date(), "yM");
            if (now.month === 11) {
                now.month = 0;
                now.year += 1;
            } else {
                now.month++;
            }
            return  d.year === now.year &&
                    d.month === now.month;
        },
        thisYear: function (target: Date) : boolean {
            var d = getDateParts(target, "y"), 
                now = getDateParts(new Date(), "y");
            return  d.year === now.year;
        },
        lastYear: function (target: Date) : boolean {
            var d = getDateParts(target, "y"), 
                now = getDateParts(new Date(), "y");
            return  d.year === now.year - 1;
        },
        nextYear: function (target: Date) : boolean {
            var d = getDateParts(target, "y"), 
                now = getDateParts(new Date(), "y");
            return  d.year === now.year + 1;
        },
        null: function (target: Date) : boolean {
            return target === null;
        },
        notNull: function (target: Date) : boolean {
            return target !== null;
        },
        empty: function (target: Date) : boolean {
            return target === null || target === undefined;
        },
        notEmpty: function (target: Date) : boolean {
            return target !== null && target !== undefined;
        }
    }
}