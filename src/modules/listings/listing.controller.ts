import { Request, Response } from 'express';
import { ListingService } from './listing.service';
import { ApiResponse } from '../../utils/ApiResponse';

const listingService = new ListingService();

export class ListingController {
    // Public
    async getListings(req: Request, res: Response) {
        const result = await listingService.getListings(req.query as any);
        res.json(ApiResponse.paginated(result.listings, result.total, result.page, result.limit));
    }

    async getFeatured(_req: Request, res: Response) {
        const listings = await listingService.getFeatured();
        res.json(ApiResponse.ok(listings));
    }

    async getLatest(_req: Request, res: Response) {
        const listings = await listingService.getLatest();
        res.json(ApiResponse.ok(listings));
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const listing = await listingService.getById(id);
        res.json(ApiResponse.ok(listing));
    }

    async incrementView(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await listingService.incrementView(id);
        res.json(ApiResponse.ok(null, 'تم تسجيل الزيارة'));
    }

    async search(req: Request, res: Response) {
        const { q, governorateId, page, limit } = req.query as any;
        if (!q) {
            return res.json(ApiResponse.ok([]));
        }
        const result = await listingService.search(q, governorateId, page, limit);
        res.json(ApiResponse.paginated(result.listings, result.total, result.page, result.limit));
    }

    // Admin
    async getAll(req: Request, res: Response) {
        const result = await listingService.getAll(req.query as any);
        res.json(ApiResponse.paginated(result.listings, result.total, result.page, result.limit));
    }

    async create(req: Request, res: Response) {
        const listing = await listingService.create(req.body);
        res.status(201).json(ApiResponse.ok(listing, 'تم إنشاء الإدخال بنجاح'));
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const listing = await listingService.update(id, req.body);
        res.json(ApiResponse.ok(listing, 'تم تحديث الإدخال بنجاح'));
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await listingService.delete(id);
        res.json(ApiResponse.ok(null, 'تم حذف الإدخال بنجاح'));
    }
}
