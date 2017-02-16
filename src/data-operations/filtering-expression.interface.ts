import { FilteringCondition } from "./filtering-condition";
export enum FilteringLogic {
    And,
    Or
};
/**
 * Represents filtering expressions.
 */
export declare interface FilteringExpression {
   fieldName: string;
   condition: (value: any, expression: FilteringExpression, ignoreCase: boolean, record: Object)=> boolean;
   searchVal?: any;
   ignoreCase?: boolean;
}