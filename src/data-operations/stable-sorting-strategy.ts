import { SortingStrategy } from "./sorting-strategy";

export class StableSortingStrategy extends SortingStrategy {
    compareFunction(obj1: any, obj2: any,
                    key: string, reverse: number, ignoreCase: boolean): number {
        var res = super.compareFunction.apply(this, arguments), 
            replacerFn = function (key, val) { 
                            if (val === undefined)
                                return null;
                            return val;
                        };
        if (!res) {
            return JSON.stringify(obj1, replacerFn)
                        .localeCompare(JSON.stringify(obj2, replacerFn));
        }
        return res;
    }
}