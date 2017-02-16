/* class provides helper functions for testing */
const COUNT_ROWS = 5;
const COUNT_COLS = 4;

export class TestHelper {
    generateArray(startValue, endValue) {
        var len = Math.abs(startValue - endValue),
            decrement = len > 0;
        return Array.from({length: len + 1}, (e,i)=> decrement? startValue - i: startValue + i);
    }
    getValuesForColumn(data, fieldName) {
        return data.map((x) => x[fieldName]);
    }
    generateColumns(countCols) {
        var i:number,
            len: number,
            res,
            defaultColumns = [
                {
                    name: "number",
                    type: "number"
                },
                {
                    name: "string",
                    type: "string"
                },
                {
                    name: "date",
                    type: "date"
                },
                {
                    name: "boolean",
                    type: "boolean"
                }
            ];
        if (countCols <= 0) {
            return defaultColumns;
        }
        if (countCols <= defaultColumns.length) {
            return defaultColumns.slice(0, countCols);
        }
        len = countCols - defaultColumns.length;
        res = defaultColumns;
        for (i =0; i < len; i++) {
            res.push({
                name: `col${i}`,
                type: "string"
            })
        }
    }
    generateData(countRows: number = COUNT_ROWS, countCols: number = COUNT_COLS) {
        var i, j, data = [], rec, val, col, cols = this.generateColumns(countCols);
        for (i = 0; i < countRows; i++) {
            rec = {};
            for (j = 0; j < cols.length; j++) {
                col = cols[j];
                switch(col.type) {
                    case "number":
                        val = i;
                        break;
                    case "date":
                        val = new Date(Date.now() + i * 24*60*60*1000);
                        break;
                    case "boolean":
                        val = !!(i % 2);
                        break;
                    default:
                        val = `row${i}, col${j}`;
                        break;
                }
                rec[col.name] = val;
            }
            data.push(rec);
        }
        return data;
    }
}