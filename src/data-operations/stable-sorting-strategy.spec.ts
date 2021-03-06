import {
    async,
    TestBed
} from "@angular/core/testing";
import { Component, ViewChild } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";
import { DataGenerator} from "./test-util/data-generator";

import { SortingDirection, SortingStrategy, StableSortingStrategy } from "../main";

describe("Unit testing StableSortingStrategy", () => {
    var dataGenerator:DataGenerator,
        data:Object[],
        strategy: SortingStrategy;
    beforeEach(() => {
        dataGenerator = new DataGenerator(100);
        data = dataGenerator.data;
        strategy = new StableSortingStrategy();
    });
    it("tests `sort`", () => {
        var sort0, sort1;
        data.forEach((item, index) => item["number"] = index % 2 ? 0: 1);
        
        strategy.sort(data, [{fieldName: "number", dir: SortingDirection.Asc}]);
        sort0 = dataGenerator.getValuesForColumn(data, "string").join("");
        
        strategy.sort(data, [{fieldName: "number", dir: SortingDirection.Asc}]);
        sort1 = dataGenerator.getValuesForColumn(data, "string").join("");
        expect(sort0).toEqual(sort1);
    });
});