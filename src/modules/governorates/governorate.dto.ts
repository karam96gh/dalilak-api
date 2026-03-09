import { z } from 'zod';

export const createGovernorateDto = z.object({
    name: z.string().min(1, 'اسم المحافظة مطلوب').max(100),
    isActive: z.boolean().default(true),
    order: z.number().int().default(0),
});

export const updateGovernorateDto = createGovernorateDto.partial();

export type CreateGovernorateDto = z.infer<typeof createGovernorateDto>;
export type UpdateGovernorateDto = z.infer<typeof updateGovernorateDto>;
