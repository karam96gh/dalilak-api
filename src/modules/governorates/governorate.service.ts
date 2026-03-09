import prisma from '../../config/database';
import { ApiError } from '../../utils/ApiError';

interface GovernorateData {
    name: string;
    isActive?: boolean;
    order?: number;
}

export class GovernorateService {
    async getAll() {
        return prisma.governorate.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { listings: true } },
            },
        });
    }

    // Admin: get all including inactive
    async getAllAdmin() {
        return prisma.governorate.findMany({
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { listings: true } },
            },
        });
    }

    async create(data: GovernorateData) {
        return prisma.governorate.create({ data });
    }

    async update(id: number, data: Partial<GovernorateData>) {
        const existing = await prisma.governorate.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('المحافظة غير موجودة');

        return prisma.governorate.update({ where: { id }, data });
    }

    async delete(id: number) {
        const existing = await prisma.governorate.findUnique({
            where: { id },
            include: { _count: { select: { listings: true } } },
        });
        if (!existing) throw ApiError.notFound('المحافظة غير موجودة');

        if (existing._count.listings > 0) {
            throw ApiError.badRequest('لا يمكن حذف محافظة تحتوي على إدخالات');
        }

        return prisma.governorate.delete({ where: { id } });
    }
}
