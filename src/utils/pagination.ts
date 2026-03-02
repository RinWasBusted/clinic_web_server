import prisma from "./prisma.js";

export const paginateDefaultSettings = {
  limit: 10,
  page: 1,
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

// Parse and calculate pagination limit
export function getPaginationLimit(query: PaginationLimit): PaginationResult {
  const page = Number(query.page) || paginateDefaultSettings.page;
  const take = Number(query.limit) || paginateDefaultSettings.limit;
  const skip = (page - 1) * take;

  return { skip, take, page };
}

// Generate pagination metadata
export function createPaginationMeta(
  totalItems: number,
  currentPage: number,
  take: number,
  itemCount: number
): PaginationMeta {
  return {
    totalItems,
    totalPages: Math.ceil(totalItems / take),
    currentPage,
    itemCount,
  };
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
// Generic Prisma pagination wrapper
export async function paginateQuery(
  model: any,
  where: any,
  query: PaginationLimit,
  options?: { include?: any; select?: any; orderBy?: any }
) {
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
