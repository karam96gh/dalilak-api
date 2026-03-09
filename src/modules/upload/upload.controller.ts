import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { getEnv } from '../../config/env';

export class UploadController {
    // Single image upload
    async uploadImage(req: Request, res: Response) {
        if (!req.file) {
            throw ApiError.badRequest('لم يتم رفع أي صورة');
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(201).json(
            ApiResponse.ok({ imageUrl }, 'تم رفع الصورة بنجاح')
        );
    }

    // Multiple images upload
    async uploadImages(req: Request, res: Response) {
        console.log('Upload request files:', req.files); // Debug log
        
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            throw ApiError.badRequest('لم يتم رفع أي صور');
        }

        const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        
        if (files.length === 0) {
            throw ApiError.badRequest('لم يتم رفع أي صور');
        }

        const images = files.map((file: any) => ({
            imageUrl: `/uploads/${file.filename}`,
        }));

        console.log('Uploaded images:', images); // Debug log

        res.status(201).json(
            ApiResponse.ok(images, 'تم رفع الصور بنجاح')
        );
    }

    // Delete image
    async deleteImage(req: Request, res: Response) {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            throw ApiError.badRequest('رابط الصورة مطلوب');
        }

        const filename = path.basename(imageUrl);
        const filePath = path.join(getEnv().UPLOAD_DIR, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json(ApiResponse.ok(null, 'تم حذف الصورة بنجاح'));
    }
}
