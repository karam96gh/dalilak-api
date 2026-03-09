import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export function errorMiddleware(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // Multer errors
    if (err.message && err.message.includes('نوع الملف غير مدعوم')) {
        return res.status(400).json(ApiResponse.fail(err.message));
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(ApiResponse.fail(err.message));
    }

    // Prisma known errors
    if ((err as any).code === 'P2002') {
        return res.status(409).json(ApiResponse.fail('هذا السجل موجود مسبقاً'));
    }

    if ((err as any).code === 'P2025') {
        return res.status(404).json(ApiResponse.fail('السجل غير موجود'));
    }

    if ((err as any).code === 'P2003') {
        return res.status(400).json(ApiResponse.fail('مرجع غير صالح - تأكد من صحة المعرفات'));
    }

    console.error('❌ Unhandled Error:', err);

    const message =
        process.env.NODE_ENV === 'development' ? err.message : 'خطأ داخلي في الخادم';

    return res.status(500).json(ApiResponse.fail(message));
}
