export declare const paginateDefaultSettings: {
    limit: number;
    page: number;
};
export interface PaginationLimit {
    page?: string | number;
    limit?: string | number;
}
export interface PaginationResult {
    skip: number;
    take: number;
    page: number;
}
export interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemCount: number;
}
export declare function getPaginationLimit(query: PaginationLimit): PaginationResult;
export declare function createPaginationMeta(totalItems: number, currentPage: number, take: number, itemCount: number): PaginationMeta;
export declare function paginateQuery(model: any, where: any, query: PaginationLimit, options?: {
    include?: any;
    select?: any;
    orderBy?: any;
}): Promise<{
    data: any;
    pagination: PaginationMeta;
}>;
//# sourceMappingURL=pagination.d.ts.map