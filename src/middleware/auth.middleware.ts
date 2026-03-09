import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
    adminId?: number;
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('التوكن مطلوب');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, getEnv().JWT_SECRET) as { id: number };
        req.adminId = decoded.id;
        next();
    } catch (error) {
        throw ApiError.unauthorized('توكن غير صالح أو منتهي الصلاحية');
    }
}
