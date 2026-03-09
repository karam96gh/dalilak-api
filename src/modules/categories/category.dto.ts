import { z } from 'zod';

export const createCategoryDto = z.object({
    name: z.string().min(1, 'اسم القسم مطلوب').max(150),
    icon: z.string().max(255).optional().nullable(),
    image: z.string().max(255).optional().nullable(),
    parentId: z.number().int().positive().optional().nullable(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

export const updateCategoryDto = createCategoryDto.partial();

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
