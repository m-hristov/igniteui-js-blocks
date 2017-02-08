import { SortingExpression } from "./sorting-expression.interface";

export interface ISortingStrategy {
    ignoreCase: boolean;
    sort: (data: any[], expressions: SortingExpression[]) => any[];
    //compareFunction: (a, b) => -1|1|0;
}
