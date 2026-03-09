import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { getEnv } from '../../config/env';

const execAsync = promisify(exec);

export class AdminUtilsController {
    /**
     * Reset database (seed)
     * Only available in development
     */
    async resetDatabase(_req: Request, res: Response) {
        if (getEnv().NODE_ENV === 'production') {
            throw ApiError.forbidden('هذه العملية غير متاحة في بيئة الإنتاج');
        }

        try {
            console.log('🔄 جاري إعادة تعيين قاعدة البيانات...');
            
            // Run prisma seed
            await execAsync('npm run prisma:seed');
            
            res.json(ApiResponse.ok(
                { message: 'تمت إعادة تعيين قاعدة البيانات بنجاح' },
                'تمت إعادة التعيين بنجاح'
            ));
        } catch (error: any) {
            console.error('Failed to reset database:', error);
            throw ApiError.internal('فشل إعادة تعيين قاعدة البيانات: ' + error.message);
        }
    }

    /**
     * Get database statistics
     */
    async getDatabaseStats(_req: Request, res: Response) {
        const prisma = require('../../config/database').default;
        
        try {
            const [
                adminCount,
                govCount,
                catCount,
                listingCount,
                imageCount,
                notificationCount,
                adCount,
            ] = await Promise.all([
                prisma.adminUser.count(),
                prisma.governorate.count(),
                prisma.category.count(),
                prisma.listing.count(),
                prisma.listingImage.count(),
                prisma.notification.count(),
                prisma.ad.count(),
            ]);

            res.json(ApiResponse.ok({
                adminUsers: adminCount,
                governorates: govCount,
                categories: catCount,
                listings: listingCount,
                listingImages: imageCount,
                notifications: notificationCount,
                ads: adCount,
                total: adminCount + govCount + catCount + listingCount + imageCount + notificationCount + adCount,
            }));
        } catch (error: any) {
            throw ApiError.internal('خطأ في جلب الإحصائيات: ' + error.message);
        }
    }

    /**
     * Health check with database connection
     */
    async healthCheck(_req: Request, res: Response) {
        const prisma = require('../../config/database').default;
        
        try {
            // Test database connection
            await prisma.$queryRaw`SELECT 1`;
            
            res.json(ApiResponse.ok({
                status: 'healthy',
                database: 'connected',
                environment: getEnv().NODE_ENV,
                timestamp: new Date().toISOString(),
            }));
        } catch (error: any) {
            res.status(503).json(ApiResponse.fail('فشل الاتصال بقاعدة البيانات'));
        }
    }
}
