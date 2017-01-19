/**
 * Represents filtering expressions.
 */
export interface FilteringExpression {
   fieldName: string;
   operator: string | Function;
   searchVal?: any;
   caseSensitive?: boolean;
   type?: "string"|"number"|"boolean"|"date";
   dateFormat?: "string";
   resolvedOperator: Function;
}