import { Request, Response } from 'express';
import { AdService } from './ad.service';
import { ApiResponse } from '../../utils/ApiResponse';

const adService = new AdService();

export class AdController {
    // Public
    async getActive(_req: Request, res: Response) {
        const ads = await adService.getActive();
        res.json(ApiResponse.ok(ads));
    }

    // Admin
    async getAll(_req: Request, res: Response) {
        const ads = await adService.getAll();
        res.json(ApiResponse.ok(ads));
    }

    async create(req: Request, res: Response) {
        const ad = await adService.create(req.body);
        res.status(201).json(ApiResponse.ok(ad, 'تم إنشاء الإعلان بنجاح'));
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const ad = await adService.update(id, req.body);
        res.json(ApiResponse.ok(ad, 'تم تحديث الإعلان بنجاح'));
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await adService.delete(id);
        res.json(ApiResponse.ok(null, 'تم حذف الإعلان بنجاح'));
    }

    async reorder(req: Request, res: Response) {
        const { ids } = req.body;
        await adService.reorder(ids);
        res.json(ApiResponse.ok(null, 'تم إعادة الترتيب بنجاح'));
    }
}
