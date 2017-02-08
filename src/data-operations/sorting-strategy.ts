import { SortingExpression, SortingDirection } from "./sorting-expression.interface";
import { ISortingStrategy } from "./sorting-strategy.interface";

export class SortingStrategy implements ISortingStrategy {
    ignoreCase: boolean = true;
    sort(data: any[], expressions: SortingExpression[]): any[] {
        return this.sortDataRecursive(data, expressions);
    }
    arraySort<T> (data: T[], compareFn?): T[] {
        return data.sort(compareFn);
    }
    private groupedRecordsByExpression<T> (data: T[], index: number, expression: SortingExpression): T[] {
        var i, res = [], cmpRes, groupval,
            key = expression.fieldName,
            len = data.length,
            cmpFunc = function (val1, val2): boolean {
                return val1 === val2;
            };
        res.push(data[ index ]);
        groupval = data[ index ][ key ];
        index++;
        for (i = index; i < len; i++) {
            if (cmpFunc(data[ i ][ key ], groupval)) {
                res.push(data[ i ]);
            } else {
                break;
            }
        }
        return res;
    }
    compareFunction(key: string, dirDesc: boolean, ignoreCase: boolean) {
        var reverse: number = dirDesc ? -1 : 1;
        return function (obj1, obj2) {
            var a = obj1[key], b = obj2[key], arr1, arr2,
                aNull = (a === null || a === undefined),
                bNull = (b === null || b === undefined);
            if (aNull) {
                if (bNull) {
                    return 0;
                }
                return reverse * -1;
            } else if (bNull) {
                return reverse * 1;
            }
            if (ignoreCase) {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }
            return reverse * (a > b ? 1 : a < b ? -1 : 0);
        };
    }
    private sortByFieldExpression<T> (data: T[], expression: SortingExpression): T[] {
        var arr = [], sortF,
            key = expression.fieldName,
            ignoreCase = expression.ignoreCase ? data[0] && typeof data[0][key] === "string": false;
        return this.arraySort(data, this.compareFunction(key, expression.dir === SortingDirection.desc, ignoreCase));
    }

    private sortDataRecursive<T> (data: T[],
                            expressions: SortingExpression[],
                            expressionIndex: number = 0): T[] {
        var i, j, dataLen = data.length, expr, gbExpr, gbData, gbDataLen,
            exprsLen = expressions.length;
        expressionIndex = expressionIndex || 0;
        if (expressionIndex >= exprsLen || dataLen <= 1) {
            return data;
        }
        expr = expressions[ expressionIndex ];
        data = this.sortByFieldExpression(data, expr);
        if (expressionIndex === exprsLen - 1) {
            return data;
        }
        // in case of multiple sorting
        for (i = 0; i < dataLen; i++) {
            gbData = this.groupedRecordsByExpression(data, i, expr);
            gbDataLen = gbData.length;
            if (gbDataLen > 1) {
                gbData = this.sortDataRecursive(gbData, expressions, expressionIndex + 1);
            }
            for (j = 0; j < gbDataLen; j++) {
                data[ i + j ] = gbData[ j ];
            }
            i += gbDataLen - 1;
        }
        return data;
    }
}