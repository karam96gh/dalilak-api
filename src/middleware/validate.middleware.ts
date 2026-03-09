import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../utils/ApiResponse';

export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('Validating request body:', JSON.stringify(req.body, null, 2)); // Debug log
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code,
            }));

            console.error('Validation errors:', errors); // Debug log

            return res.status(400).json({
                success: false,
                message: 'بيانات غير صالحة',
                errors,
            });
        }

        req.body = result.data;
        next();
    };
}

export function validateQuery(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code,
            }));

            return res.status(400).json({
                success: false,
                message: 'معاملات الاستعلام غير صالحة',
                errors,
            });
        }

        req.query = result.data;
        next();
    };
}
