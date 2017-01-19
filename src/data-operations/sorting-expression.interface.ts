/**
 * Represents sorting expressions.
 */
//export type SortingDirection = "asc" | "desc";
export interface SortingExpression {
   fieldName: string;
   dir: "asc" | "desc";
   compareFunc?: Function;
}