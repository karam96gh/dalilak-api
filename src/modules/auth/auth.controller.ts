import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        const result = await authService.login(req.body);
        res.json(ApiResponse.ok(result, 'تم تسجيل الدخول بنجاح'));
    }

    async logout(_req: Request, res: Response) {
        res.json(ApiResponse.ok(null, 'تم تسجيل الخروج بنجاح'));
    }

    async me(req: AuthRequest, res: Response) {
        const admin = await authService.getProfile(req.adminId!);
        res.json(ApiResponse.ok(admin));
    }
}
