import { FilteringCondition } from "./filtering-condition";
export enum FilteringLogic {
    And,
    Or
};
export declare interface FilteringExpressionSettings {
    ignoreCase?: boolean;
    dateFormat?: string;
}
/**
 * Represents filtering expressions.
 */
export declare interface FilteringExpression {
    fieldName: string;
    condition: (value: any, search?: any, settings?: Object, record?: Object)=> boolean;
    searchVal?: any;
    settings?: FilteringExpressionSettings
}