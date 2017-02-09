import { PagingData } from "./paging-data.interface";

export interface DataSourceResultData {
    filtering?: {
        transformedData: any[];
        applied: boolean;
    },
    sorting?: {
        transformedData: any[],
        applied: boolean;
    },
    paging?: {
        transformedData: any[],
        applied: boolean,
        metadata: PagingData
    }
}