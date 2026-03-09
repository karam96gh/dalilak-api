export class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string = 'طلب غير صالح'): ApiError {
        return new ApiError(400, message);
    }

    static unauthorized(message: string = 'غير مصرح'): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string = 'ممنوع الوصول'): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = 'غير موجود'): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string = 'تعارض في البيانات'): ApiError {
        return new ApiError(409, message);
    }

    static internal(message: string = 'خطأ داخلي في الخادم'): ApiError {
        return new ApiError(500, message, false);
    }
}
