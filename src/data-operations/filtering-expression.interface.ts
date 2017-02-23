import { FilteringCondition } from "./filtering-condition";
import {FilteringExpressionSettings} from "./filtering-expression-settings.interface";
export enum FilteringLogic {
    And,
    Or
};

/**
 * Represents filtering expressions.
 */
export declare interface FilteringExpression {
    fieldName: string;
    condition: (value: any, search?: any, settings?: Object, record?: Object)=> boolean;
    searchVal?: any;
    settings?: FilteringExpressionSettings
}