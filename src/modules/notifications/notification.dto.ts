import { z } from 'zod';

export const createNotificationDto = z.object({
    title: z.string().min(1, 'العنوان مطلوب').max(255),
    body: z.string().min(1, 'محتوى الإشعار مطلوب'),
    image: z.string().max(255).optional().nullable(),
    linkType: z.string().max(50).optional().nullable(),
    linkId: z.number().int().optional().nullable(),
    linkUrl: z.string().url('رابط غير صالح').optional().nullable(),
    isActive: z.boolean().default(true),
});

export const updateNotificationDto = createNotificationDto.partial();

export type CreateNotificationDto = z.infer<typeof createNotificationDto>;
export type UpdateNotificationDto = z.infer<typeof updateNotificationDto>;
