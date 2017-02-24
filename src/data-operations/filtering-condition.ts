// helper functions
function applyIgnoreCase (a: string, ignoreCase: boolean) : string {
    a = a || "";
    // bulletproof
    return ignoreCase? ("" + a).toLowerCase() : a;
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

export declare type FilteringConditionArgs = {
                                                            search?; 
                                                            ignoreCase?: boolean;
                                                            record?; 
                                                            index?: number,
                                                            settings?: any
                                                        };

export var FilteringCondition = {
    string: {
        contains: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
            return target.indexOf(search) !== -1;
        },
        startsWith: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
            return target.startsWith(search);
        },
        endsWith: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
            return target.endsWith(search);
        },
        doesNotContain: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
            return target.indexOf(search) === -1;
        },
        equals: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
            return target === search;
        },
        doesNotEqual: function (target: string, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            var search = applyIgnoreCase(args.search, args.ignoreCase);
            target = applyIgnoreCase(target, args.ignoreCase);
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
        equals: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target === args.search;
        },
        doesNotEqual: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target !== args.search;
        },
        greaterThan: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target > args.search;
        },
        lessThan: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target < args.search;
        },
        greaterThanOrEqualTo: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target >= args.search;
        },
        lessThanOrEqualTo: function (target: number, args: FilteringConditionArgs) : boolean
        {
            args = args || {};
            return target <= args.search;
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
        equals: function (target: Date, args: FilteringConditionArgs) : boolean {
            args = args || {};
            return +target === +args.search;
        },
        doesNotEqual: function (target: Date, args: FilteringConditionArgs) : boolean {
            return !FilteringCondition.date.equals(target, args);
        },
        before: function (target: Date, args: FilteringConditionArgs) : boolean {
            args = args || {};
            return target < args.search;
        },
        after: function (target: Date, args: FilteringConditionArgs) : boolean {
            args = args || {};
            return target > args.search;
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