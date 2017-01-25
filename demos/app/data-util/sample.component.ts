import { Component, Input, ViewChild, OnInit, DoCheck } from "@angular/core";
import { DataSource } from "../../../src/data-operations/data-source";
import { DataUtil } from "../../../src/data-operations/data-util";
import { FilteringOperators } from "../../../src/data-operations/filtering-operators";
import {FilteringExpression} from "../../../src/data-operations/filtering-expression.interface";
import { SortingExpression} from "../../../src/data-operations/sorting-expression.interface";
import { PagingData } from "../../../src/data-operations/paging-data.interface";
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
            <tr *ngFor="let dataRow of dataSource? dataSource.dataView : (data || [])" >
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
export class DataUtilSampleComponent implements OnInit, DoCheck {
    data: any;
    dataSource: DataSource;
    dataSourceSettings;
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
    @ViewChild("list") list: DataIterator;
    constructor() {
    }
    ngOnInit() {
        this.data = this.generateData(8, 5);// generates 10 rows with 5 columns in each row
        this.dataSource = new DataSource(this.data.rows, this.data.rows.length);
        this.renderList();
        //this.renderPageData();
        // this.renderFilterData();
        //this.renderSortedData();
    }
    ngDoCheck() {

    }
    getDefaultDSSettings() {
        var settings,
            // filtering expression
            fe = <FilteringExpression> {
                                        operator: FilteringOperators.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 0},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: "desc"
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: "desc"
                                    };
        return {
            filtering: {
                expressions: [fe]
            },
            sorting: {
                expressions: [se1, se0]
            }
        }
    }
    renderList() {
        var ds = this.dataSource,
            // filtering expression
            fe = <FilteringExpression> {
                                        operator: FilteringOperators.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 0},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: "desc"
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: "desc"
                                    },
            res,
            t = new Date().getTime(),
            keys = this.data.keys;// generates 10 rows with 3 columns in each row;
        //setup datasource
        ds.settings.filtering.expressions = [fe];
        ds.settings.sorting.expressions = [se1, se0];
        this.dataSourceSettings = Object.assign({}, ds.settings);
        ds.settings.paging = {
            pageIndex: 0,
            pageSize: 10
        }
        ds.dataBind();
        this.list.dataSource = this.dataSource;
        this.list.keys = keys;
    }
    reset() {
        this.dataSource.resetSettings();
        this.dataSource.dataBind();
    }
    rebind() {
        this.dataSource.settings = this.getDefaultDSSettings();
        this.dataSource.dataBind();
    }
    renderPageData() {
        var p = this.paging,
            pageIndex = p.pageIndex,
            pageSize = p.pageSize,
            // filtering expression
            fe = <FilteringExpression> {
                                        //caseSensitive: false, 
                                        operator: FilteringOperators.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 100},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: "desc"
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "col2",
                                        dir: "desc"
                                    },
            res,
            t = new Date().getTime(),
            keys = this.data.keys;// generates 10 rows with 3 columns in each row;
        this.dataSource
            .dataBind()
            .filter([fe], true)
            //.sort([se0/*, se1 */], true)
            .page(pageIndex, pageSize);
        res = this.dataSource.resultData.paging.res;
        p.pageInfo = res.err || `Page: ${pageIndex + 1} of ${res.pageCount} page(s) | 
                                Total rows count: ${res.total} | 
                                Time: ${new Date().getTime() - t} ms.`;
        this.listPagingData.dataSource = this.dataSource;
        this.listPagingData.keys = keys;
    }
    test () {
        var dv = this.data.rows;
        this.dataSource.dataView[0]["number"] = -1000;
        dv = this.dataSource.dataView;
        (dv[0] || {})["col2"] = "Teeeest";
    }
    renderFilterData() {
        var t = new Date().getTime(),
            fe = <FilteringExpression> {
                                        ignoreCase: true, 
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
        if (countCols - predCols.length <= 0) {
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
        var i, j, data = [], row, cols = this.generateColumns(countCols), key;
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