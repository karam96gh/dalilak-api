import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { ApiResponse } from '../../utils/ApiResponse';

const notificationService = new NotificationService();

export class NotificationController {
    // Public
    async getAll(req: Request, res: Response) {
        const result = await notificationService.getAll(req.query as any);
        res.json(ApiResponse.paginated(result.notifications, result.total, result.page, result.limit));
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const notification = await notificationService.getById(id);
        res.json(ApiResponse.ok(notification));
    }

    // Admin
    async getAllAdmin(req: Request, res: Response) {
        const result = await notificationService.getAllAdmin(req.query as any);
        res.json(ApiResponse.paginated(result.notifications, result.total, result.page, result.limit));
    }

    async create(req: Request, res: Response) {
        const notification = await notificationService.create(req.body);
        res.status(201).json(ApiResponse.ok(notification, 'تم إنشاء الإشعار بنجاح'));
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const notification = await notificationService.update(id, req.body);
        res.json(ApiResponse.ok(notification, 'تم تحديث الإشعار بنجاح'));
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await notificationService.delete(id);
        res.json(ApiResponse.ok(null, 'تم حذف الإشعار بنجاح'));
    }
}
