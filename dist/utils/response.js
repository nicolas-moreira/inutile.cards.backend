export function successResponse(data, message) {
    return {
        success: true,
        data,
        message,
    };
}
export function errorResponse(error) {
    return {
        success: false,
        error,
    };
}
export function paginatedResponse(data, page, limit, total) {
    return {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        },
    };
}
//# sourceMappingURL=response.js.map