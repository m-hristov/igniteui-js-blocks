import {BoolLogic} from "./filtering-expression.interface"

export interface FilteringSettings {
    boolLogic?: BoolLogic;
    ignoreCase?: boolean;
    customFiltering?: Function;
}