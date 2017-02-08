import { FilteringExpression, BoolLogic } from "./filtering-expression.interface";
import {IFilteringStrategy, FilteringStrategy} from "./filtering-strategy";
import { SortingExpression } from "./sorting-expression.interface";
import {ISortingStrategy} from "./sorting-strategy.interface";

export interface DataSourceSettings {
    filtering?: {
        expressions?: Array<FilteringExpression>,
        boolLogic?: BoolLogic;
        ignoreCase?: boolean;
        strategy?: IFilteringStrategy;
    },
    sorting?: {
        expressions?: Array<SortingExpression>,
        strategy?: ISortingStrategy
    },
    paging?: {
        disabled?: boolean,
        pageIndex: number,
        pageSize: number
    }
}