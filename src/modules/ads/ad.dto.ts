import { z } from 'zod';

export const createAdDto = z.object({
    image: z.string().min(1, 'الصورة مطلوبة'),
    linkType: z.string().max(50).optional().nullable(),
    linkId: z.number().int().optional().nullable(),
    linkUrl: z.string().url('رابط غير صالح').optional().nullable(),
    order: z.number().int().default(0),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    isActive: z.boolean().default(true),
});

export const updateAdDto = createAdDto.partial();

export type CreateAdDto = z.infer<typeof createAdDto>;
export type UpdateAdDto = z.infer<typeof updateAdDto>;
