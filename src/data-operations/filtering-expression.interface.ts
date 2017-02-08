import { FilteringCondition } from "./filtering-condition";
export enum BoolLogic {
    and,
    or
};

/**
 * Represents filtering expressions.
 */
export interface FilteringExpression {
   fieldName: string;
   condition: FilteringCondition|Function;
   searchVal?: any;
   ignoreCase?: boolean;
   dateFormat?: "string";
}