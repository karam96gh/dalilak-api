import fs from 'fs';
import path from 'path';
import { ApiError } from '../../utils/ApiError';
import { getEnv } from '../../config/env';

export class UploadService {
    private uploadDir = getEnv().UPLOAD_DIR;

    constructor() {
        // Create upload directory if it doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    /**
     * Get list of uploaded files
     */
    getUploadedFiles(): string[] {
        if (!fs.existsSync(this.uploadDir)) {
            return [];
        }
        return fs.readdirSync(this.uploadDir);
    }

    /**
     * Validate file
     */
    validateFile(file: any): boolean {
        if (!file) return false;
        
        const maxSize = getEnv().MAX_FILE_SIZE;
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        
        if (file.size > maxSize) {
            throw ApiError.badRequest(`حجم الملف يتجاوز الحد الأقصى: ${maxSize / 1024 / 1024}MB`);
        }
        
        if (!allowedMimes.includes(file.mimetype)) {
            throw ApiError.badRequest('صيغة الملف غير مدعومة. استخدم JPG أو PNG أو WebP');
        }
        
        return true;
    }

    /**
     * Get file info
     */
    getFileInfo(filename: string) {
        const filePath = path.join(this.uploadDir, filename);
        
        if (!fs.existsSync(filePath)) {
            throw ApiError.notFound('الملف غير موجود');
        }
        
        const stats = fs.statSync(filePath);
        return {
            filename,
            size: stats.size,
            uploadedAt: stats.birthtime,
            url: `/uploads/${filename}`,
        };
    }

    /**
     * Delete multiple files
     */
    deleteFiles(filenames: string[]): number {
        let deleted = 0;
        
        for (const filename of filenames) {
            const filePath = path.join(this.uploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    deleted++;
                } catch (error) {
                    console.error(`Failed to delete ${filename}:`, error);
                }
            }
        }
        
        return deleted;
    }

    /**
     * Get upload statistics
     */
    getStats() {
        if (!fs.existsSync(this.uploadDir)) {
            return { totalFiles: 0, totalSize: 0 };
        }

        const files = fs.readdirSync(this.uploadDir);
        let totalSize = 0;

        for (const file of files) {
            const filePath = path.join(this.uploadDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
        }

        return {
            totalFiles: files.length,
            totalSize,
            totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        };
    }

    /**
     * Clean old files (older than days)
     */
    cleanOldFiles(days: number = 30): number {
        if (!fs.existsSync(this.uploadDir)) {
            return 0;
        }

        const files = fs.readdirSync(this.uploadDir);
        const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
        let deleted = 0;

        for (const file of files) {
            const filePath = path.join(this.uploadDir, file);
            const stats = fs.statSync(filePath);

            if (stats.birthtime.getTime() < cutoffTime) {
                try {
                    fs.unlinkSync(filePath);
                    deleted++;
                } catch (error) {
                    console.error(`Failed to delete ${file}:`, error);
                }
            }
        }

        return deleted;
    }
}
