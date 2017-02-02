/**
 * Represents paging data.
 */
export interface PagingData {
    err: string;
    pageData: any[],
    pageCount: number;
    total: number;
    pageSize: number;
    pageIndex: number;
}