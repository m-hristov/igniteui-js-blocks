import { SortingStrategy } from "./sorting-strategy";

export class MergeSortingStrategy extends SortingStrategy {
    arraySort<T> (data: T[], compareFn?): T[] {
        return this.mergeSort(data, compareFn, 0, data.length);
    }

    mergeSort<T>(data: T[], compareFn: Function, start: number, end: number) {
        if (Math.abs(end - start) <= 1) {
            return data;
        }
        var middle = Math.ceil((start + end) / 2);
        this.mergeSort(data, compareFn, start, middle);
        this.mergeSort(data, compareFn, middle, end);

        return this.merge(data, compareFn, start, middle, end);
    }

    merge<T>(data: T[], compareFn: Function, start, middle, end) {
        var left = [],
            right = [],
            leftSize = middle - start,
            rightSize = end - middle,
            maxSize = Math.max(leftSize, rightSize),
            size = end - start,
            i;

        for (i = 0; i < maxSize; i += 1) {
            if (i < leftSize) {
                left[i] = data[start + i];
            }
            if (i < rightSize) {
                right[i] = data[middle + i];
            }
        }
        i = 0;
        while (i < size) {
            if (left.length && right.length) {
                if (compareFn(left[0], right[0]) >= 0) {
                    data[start + i] = right.shift();
                } else {
                    data[start + i] = left.shift();
                }
            } else if (left.length) {
                data[start + i] = left.shift();
            } else {
                data[start + i] = right.shift();
            }
            i += 1;
        }
        return data;
    }
}
