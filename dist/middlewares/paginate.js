// Custom pagination output
export async function paginateMiddleware(req, res, next) {
    res.paginate = (data, pagination) => {
        return res.status(200).json({
            data,
            pagination: {
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages,
                itemCount: pagination.itemCount,
                currentPage: pagination.currentPage,
            },
        });
    };
    return next();
}
//# sourceMappingURL=paginate.js.map