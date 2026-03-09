import prisma from '../../config/database';
import { ApiError } from '../../utils/ApiError';

interface AdData {
    image: string;
    linkType?: string | null;
    linkId?: number | null;
    linkUrl?: string | null;
    order?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    isActive?: boolean;
}

export class AdService {
    // Public: get active ads
    async getActive() {
        const now = new Date();
        return prisma.ad.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null, endDate: null },
                    { startDate: { lte: now }, endDate: null },
                    { startDate: null, endDate: { gte: now } },
                    { startDate: { lte: now }, endDate: { gte: now } },
                ],
            },
            orderBy: { order: 'asc' },
        });
    }

    // Admin
    async getAll() {
        return prisma.ad.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async create(data: AdData) {
        return prisma.ad.create({ data });
    }

    async update(id: number, data: Partial<AdData>) {
        const existing = await prisma.ad.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإعلان غير موجود');

        return prisma.ad.update({ where: { id }, data });
    }

    async delete(id: number) {
        const existing = await prisma.ad.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإعلان غير موجود');

        return prisma.ad.delete({ where: { id } });
    }

    async reorder(ids: number[]) {
        const updates = ids.map((id, index) =>
            prisma.ad.update({ where: { id }, data: { order: index } })
        );
        await prisma.$transaction(updates);
    }
}
