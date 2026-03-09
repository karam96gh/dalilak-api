import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { ApiResponse } from '../../utils/ApiResponse';

const categoryService = new CategoryService();

export class CategoryController {
    // Public
    async getRootCategories(_req: Request, res: Response) {
        const categories = await categoryService.getRootCategories();
        res.json(ApiResponse.ok(categories));
    }

    async getChildren(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const children = await categoryService.getChildren(id);
        res.json(ApiResponse.ok(children));
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const category = await categoryService.getById(id);
        res.json(ApiResponse.ok(category));
    }

    // Admin
    async getAllTree(_req: Request, res: Response) {
        const tree = await categoryService.getAllTree();
        res.json(ApiResponse.ok(tree));
    }

    async create(req: Request, res: Response) {
        const category = await categoryService.create(req.body);
        res.status(201).json(ApiResponse.ok(category, 'تم إنشاء القسم بنجاح'));
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const category = await categoryService.update(id, req.body);
        res.json(ApiResponse.ok(category, 'تم تحديث القسم بنجاح'));
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        await categoryService.delete(id);
        res.json(ApiResponse.ok(null, 'تم حذف القسم بنجاح'));
    }
}
