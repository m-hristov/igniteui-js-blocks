import { PagingData } from "./paging-data.interface";

export interface DataSourceResultData {
    filtering?: {
        data: any[];
        applied: boolean;
    },
    sorting?: {
        data: any[],
        applied: boolean;
    },
    paging?: {
        data: any[],
        applied: boolean,
        pagingData: PagingData
    }
}