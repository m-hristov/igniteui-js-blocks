import { Component, Input, ViewChild, OnInit } from "@angular/core";
import { DataSource } from "../../../src/data-operations/datasource";
import { GridData } from "../../../src/data-operations/grid-data.interface";
import { DataUtil } from "../../../src/data-operations/data-util";
import { FilterOperators } from "../../../src/data-operations/filter-operators";
import {FilteringExpression} from "../../../src/data-operations/filtering-expression.interface";
import { SortingExpression} from "../../../src/data-operations/sorting-expression.interface";
@Component({
    selector: "data-iterator",
    moduleId: module.id,
    template: `
    <style>
        .my-table {
            border-spacing: 2px;
            border-collapse: collapse;
        }
        .my-table td, th {
            padding: 5px;
            border: solid 1px gray;
        }
    </style>
    <table class="my-table">
        <thead>
            <tr>
                <th *ngFor="let key of keys">
                    {{key}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let dataRow of dataSource? dataSource.dataView : data" >
                <td *ngFor="let key of keys">
                    {{dataRow[key]}}
                </td>
            </tr>
        </tbody>
</table>`
})
export class DataIterator {
    @Input() data: Object[] = [];
    @Input() keys: string[] = [];
    @Input() dataSource: DataSource;
}

@Component({
    selector: "data-util-sample",
    moduleId: module.id,
    templateUrl: './sample.component.html'
})
export class DataUtilSampleComponent implements OnInit {
    data: any;
    dataSource: DataSource;
    private paging = {
        pageSize: 5,
        pageIndex: 0,
        pageInfo: ""
    };
    private filtering = {
        searchVal: "",
        info: "row 1"
    };
    private sorting = {
        key: "col1",
        dir: "desc",
        info: ""
    };
    // paging sample vars
    @ViewChild("listPagingData") listPagingData: DataIterator;
    @ViewChild("listFilteringData") listFilteringData: DataIterator;
    @ViewChild("listSortingData") listSortingData: DataIterator;

    constructor() {
    }
    ngOnInit() {
        this.data = this.generateData(35000, 5);// generates 10 rows with 5 columns in each row
        this.dataSource = new DataSource(this.data.rows, this.data.rows.length);
        this.renderPageData();
        // this.renderFilterData();
        //this.renderSortedData();
    }
    renderPageData() {
        var p = this.paging,
            pageIndex = p.pageIndex,
            pageSize = p.pageSize,
            // filtering expression
            fe = <FilteringExpression> {
                                        caseSensitive: false, 
                                        operator: FilterOperators.string.contains,
                                        fieldName: "col2",
                                        "searchVal": this.filtering.searchVal},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: this.sorting.key || "col1",
                                        dir: "desc"
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "col2",
                                        dir: "desc"
                                    },
            res, t0,
            t = new Date().getTime(),
            keys = this.data.keys;// generates 10 rows with 3 columns in each row;
            
        this.dataSource
            .filter([fe], {ignoreCase: true}, this.dataSource.data)
            .sort([se0, se1], {ignoreCase: true})
            .page(pageIndex, pageSize);
        
        res = this.dataSource.pagingData;
        p.pageInfo = res.err || `Page: ${pageIndex + 1} of ${res.pageCount} page(s) | 
                                Total rows count: ${res.total} | 
                                Time: ${new Date().getTime() - t} ms.`;
        this.listPagingData.dataSource = this.dataSource;
        this.listPagingData.keys = keys;
    }
    test () {
        var dv = this.data.rows;//dv = this.dataSource.dataView;
        (dv[0] || {})["col2"] = "Teeeest";
    }
    renderFilterData() {
        var t = new Date().getTime(),
            fe = <FilteringExpression> {
                                        caseSensitive: false, 
                                        operator: "today",
                                        fieldName: "date",
                                        "searchVal": this.filtering.searchVal},
            res = DataUtil.filter(this.data.rows, [fe] );
        this.filtering.info = `Time to filter ${new Date().getTime() - t}`;
        this.listFilteringData.data = res;
        this.listFilteringData.keys = this.data.keys;
    }
    renderSortedData() {
        var t = new Date().getTime(),
            se0 = <SortingExpression> {
                                        fieldName: this.sorting.key || "col1",
                                        dir: "desc"
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "col2",
                                        dir: "desc"
                                    };
        this.listSortingData.data = DataUtil.sort(this.data.rows, [se0, se1]);
        this.listSortingData.keys = this.data.keys;
        this.sorting.info = `Sorting time: ${new Date().getTime() - t} ms.`;
    }
    generateColumns (countCols?: number) {
        var i, cols = [], predCols = ["date", "bool", "number"];
        if (countCols <= 0) {
            return predCols;
        }
        if (countCols - predCols.length >= 0) {
            return predCols.slice(0, countCols);
        }
        countCols = countCols - predCols.length;
        for (i = 0; i < countCols; i++) {
            cols.push(`col${i}`);
        }
        return cols.concat(predCols);

    }
    generateData(countRows?: number, countCols?: number) {
        countCols = countCols || 1;
        countRows = countRows || 0;
        var i, j, data = [], row, cols = ["date"], key;
        // generate columns
        for (j = 0; j < countCols; j++) {
            cols.push(`col${j}`);
        }
        cols.push("date");
        cols.push("bool");
        for (i = 0; i < countRows; i++) {
            row = {};
            for (j = 0; j < countCols; j++) {
                key = cols[j];
                if (key === "date") {
                    row[key] = new Date((new Date()).setDate(i));
                } else if (key === "bool") {
                    row[key] = !!(i % 2);
                } else if (key === "number") {
                    row[key] = i;
                } else {
                    row[key] = `row ${i} col ${j}`;
                }
            }
            data.push(row);
        }
        return {
            rows: data,
            keys: cols
        };
    }
}