import prisma from "./prisma.js";
export const paginateDefaultSettings = {
    limit: 10,
    page: 1,
};
// Parse and calculate pagination limit
export function getPaginationLimit(query) {
    const page = Number(query.page) || paginateDefaultSettings.page;
    const take = Number(query.limit) || paginateDefaultSettings.limit;
    const skip = (page - 1) * take;
    return { skip, take, page };
}
// Generate pagination metadata
export function createPaginationMeta(totalItems, currentPage, take, itemCount) {
    return {
        totalItems,
        totalPages: Math.ceil(totalItems / take),
        currentPage,
        itemCount,
    };
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
// Generic Prisma pagination wrapper
export async function paginateQuery(model, where, query, options) {
    const { skip, take, page } = getPaginationLimit(query);
    const [data, totalItems] = await prisma.$transaction([
        model.findMany({
            where,
            skip,
            take,
            ...options,
        }),
        model.count({ where }),
    ]);
    return {
        data,
        pagination: createPaginationMeta(totalItems, page, take, data.length),
    };
}
//# sourceMappingURL=pagination.js.map