import { Request, Response } from 'express';
import prisma from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { authMiddleware } from '../middleware/auth.middleware';

export async function statsController(req: Request, res: Response) {
    // Apply auth middleware manually
    await new Promise<void>((resolve, reject) => {
        authMiddleware(req as any, res, (err?: any) => {
            if (err) reject(err);
            else resolve();
        });
    });

    const [
        totalListings,
        activeListings,
        totalCategories,
        totalGovernorates,
        totalNotifications,
        totalAds,
        featuredListings,
    ] = await Promise.all([
        prisma.listing.count(),
        prisma.listing.count({ where: { isActive: true } }),
        prisma.category.count(),
        prisma.governorate.count(),
        prisma.notification.count(),
        prisma.ad.count({ where: { isActive: true } }),
        prisma.listing.count({ where: { isFeatured: true } }),
    ]);

    const recentListings = await prisma.listing.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            category: { select: { id: true, name: true } },
            governorate: { select: { id: true, name: true } },
        },
    });

    res.json(
        ApiResponse.ok({
            totalListings,
            activeListings,
            totalCategories,
            totalGovernorates,
            totalNotifications,
            totalAds,
            featuredListings,
            recentListings,
        })
    );
}
