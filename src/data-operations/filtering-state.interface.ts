import {FilteringLogic, FilteringExpression} from "./filtering-expression.interface";
import { IFilteringStrategy, FilteringStrategy} from "./filtering-strategy";
import { FilteringExpressionSettings } from "./filtering-expression-settings.interface";

export const filteringStateDefaults = {
    logic: FilteringLogic.And,
    strategy: new FilteringStrategy(),
    defaultExpressionSettings: {
        ignoreCase: true,
        dateFormat: "dMy"
    }
}

export declare interface FilteringState {
    expressions: Array<FilteringExpression>;
    logic?: FilteringLogic;
    strategy?: IFilteringStrategy;
    defaultExpressionSettings?: FilteringExpressionSettings;
}