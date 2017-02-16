/**
 * Represents sorting expressions.
 */
export enum SortingDirection {
    asc = 1,
    desc = 2
}

export interface SortingExpression {
   fieldName: string;
   dir: SortingDirection;
   ignoreCase?: boolean;
   compareFunction?: Function;
}