/**
 * Represents filtering expressions.
 */
export interface FilteringExpression {
   fieldName: string;
   operator: string | Function;
   searchVal?: any;
   ignoreCase?: boolean;
   type?: "string"|"number"|"boolean"|"date";
   dateFormat?: "string";
   /**
    * @hidden
    */
   resolvedOperator?: Function;
}