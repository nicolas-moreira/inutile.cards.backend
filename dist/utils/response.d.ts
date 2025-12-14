export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export declare function successResponse<T>(data: T, message?: string): ApiResponse<T>;
export declare function errorResponse(error: string): ApiResponse;
export declare function paginatedResponse<T>(data: T[], page: number, limit: number, total: number): {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
};
//# sourceMappingURL=response.d.ts.map