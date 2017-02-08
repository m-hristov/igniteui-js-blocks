import { Component, Input, ViewChild, OnInit, DoCheck } from "@angular/core";
import { DataSource, DataUtil, FilteringExpression, FilteringCondition, FilteringSettings, 
    SortingExpression, BoolLogic, SortingDirection, SortingStrategy, MergeSortingStrategy } from "../../../src/main";

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
    @ViewChild("listUpdating") listUpdating: DataIterator;
    constructor() {
    }
    ngOnInit() {
        this.data = this.generateData(100000, 5);// generates 10 rows with 5 columns in each row
        this.dataSource = new DataSource(this.data.rows, this.data.rows.length);
        //this.renderListUpdating();
        //this.renderList();
        this.renderPageData();
        // this.renderFilterData();
        //this.renderSortedData();
    }
    ngDoCheck() {
    }
    getDefaultDSSettings() {
        var settings,
            // filtering expression
            fe = <FilteringExpression> {
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        searchVal: 1
                                    },
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: SortingDirection.desc
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
    deleteRecord() {
        var ind = this.dataSource.data.length - 1;
        if (ind >= 0) {
            this.dataSource.deleteRecordByIndex(ind);
        }
    }
    addRecord() {
        this.dataSource.addRecord(this.createRecord(this.data.keys, this.data.rows.length));
        this.dataSource.dataBind();
    }
    renderListUpdating() {
        var ds = this.dataSource, cols = this.data.keys;
        ds.dataBind();
        this.listUpdating.dataSource = ds;
        this.listUpdating.keys = cols;
    }
    renderList() {
        var ds = this.dataSource,
            // filtering expression
            fe = <FilteringExpression> {
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 1},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "bool",
                                        dir: SortingDirection.desc
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
        this.dataSource.initSettings();
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
                                        condition: FilteringCondition.number.greaterThan,
                                        fieldName: "number",
                                        "searchVal": 1},
            // sorting settings
            se0 = <SortingExpression> {
                                        fieldName: "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        // fieldName: "col2",
                                        dir: SortingDirection.desc
                                    },
            res,
            t = new Date().getTime(),
            keys = this.data.keys;// generates 10 rows with 3 columns in each row;
        var fs:FilteringSettings = {
            boolLogic: BoolLogic.and,
            ignoreCase: false
        };
        this.dataSource
            .dataBind()
            .filter(
                [fe], 
                <FilteringSettings>{boolLogic:BoolLogic.and}
            )
            .sort([se0/*, se1 */], null, new MergeSortingStrategy())
            .page(pageIndex, pageSize);
        res = this.dataSource.resultData.paging.pagingData;
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
                                        condition: FilteringCondition.date.after,
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
                                        fieldName: this.sorting.key || "number",
                                        dir: SortingDirection.desc
                                    },
            se1 = <SortingExpression> {
                                        fieldName: "col2",
                                        dir: SortingDirection.desc
                                    };
        this.listSortingData.data = DataUtil.sort(this.data.rows, [se0]);
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
    createRecord(cols, i) {
        var j, len = cols.length, key, row = {};
        for (j = 0; j < len; j++) {
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
        return row;
    }
    generateData(countRows?: number, countCols?: number) {
        countCols = countCols || 1;
        countRows = countRows || 0;
        var i, j, data = [], row, cols = this.generateColumns(countCols), key;
        for (i = 0; i < countRows; i++) {
            data.push(this.createRecord(cols, i));
        }
        return {
            rows: data,
            keys: cols
        };
    }
}