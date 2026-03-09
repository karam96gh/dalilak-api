import { Request, Response } from 'express';
import { GovernorateService } from './governorate.service';
import { ApiResponse } from '../../utils/ApiResponse';

const governorateService = new GovernorateService();

export class GovernorateController {
    async getAll(_req: Request, res: Response) {
        const governorates = await governorateService.getAll();
        res.json(ApiResponse.ok(governorates));
    }

    async getAllAdmin(_req: Request, res: Response) {
        const governorates = await governorateService.getAllAdmin();
        res.json(ApiResponse.ok(governorates));
    }

    async create(req: Request, res: Response) {
        const governorate = await governorateService.create(req.body);
        res.status(201).json(ApiResponse.ok(governorate, 'تم إنشاء المحافظة بنجاح'));
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const governorate = await governorateService.update(id, req.body);
        res.json(ApiResponse.ok(governorate, 'تم تحديث المحافظة بنجاح'));
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await governorateService.delete(id);
        res.json(ApiResponse.ok(null, 'تم حذف المحافظة بنجاح'));
    }
}
