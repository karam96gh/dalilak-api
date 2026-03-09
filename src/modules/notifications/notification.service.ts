import prisma from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/paginate';

interface NotificationData {
    title: string;
    body: string;
    image?: string | null;
    linkType?: string | null;
    linkId?: number | null;
    linkUrl?: string | null;
    isActive?: boolean;
}

export class NotificationService {
    async getAll(query: { page?: string; limit?: string }) {
        const { page, limit, skip } = getPagination(query);

        const where = { isActive: true };

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where }),
        ]);

        return { notifications, total, page, limit };
    }

    async getById(id: number) {
        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification) throw ApiError.notFound('الإشعار غير موجود');
        return notification;
    }

    // Admin
    async getAllAdmin(query: { page?: string; limit?: string }) {
        const { page, limit, skip } = getPagination(query);

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count(),
        ]);

        return { notifications, total, page, limit };
    }

    async create(data: NotificationData) {
        return prisma.notification.create({ data });
    }

    async update(id: number, data: Partial<NotificationData>) {
        const existing = await prisma.notification.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإشعار غير موجود');

        return prisma.notification.update({ where: { id }, data });
    }

    async delete(id: number) {
        const existing = await prisma.notification.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإشعار غير موجود');

        return prisma.notification.delete({ where: { id } });
    }
}
