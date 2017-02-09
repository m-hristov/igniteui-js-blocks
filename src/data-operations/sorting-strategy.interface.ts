import { SortingExpression } from "./sorting-expression.interface";

export interface ISortingStrategy {
    ignoreCase: boolean;
    sort: (data: any[], expressions: SortingExpression[]) => any[];
    compareFunction: (a: any, b: any, key?: string, reverse?: number, ignoreCase?: boolean) => number;
}
