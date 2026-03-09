interface ApiResponseData<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class ApiResponse {
    static ok<T>(data: T, message: string = 'success'): ApiResponseData<T> {
        return {
            success: true,
            message,
            data,
        };
    }

    static paginated<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
        message: string = 'success'
    ): ApiResponseData<T[]> {
        return {
            success: true,
            message,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    static fail(message: string): ApiResponseData<null> {
        return {
            success: false,
            message,
        };
    }
}
