/**
 * Represents paging data.
 */
export interface PagingData {
    err: string;
    data: any[],
    pageData: any[],
    pageCount: number;
    total: number;
    pageSize: number;
    pageIndex: number;
}