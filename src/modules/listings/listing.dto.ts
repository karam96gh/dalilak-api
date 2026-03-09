import { z } from 'zod';

export const createListingDto = z.object({
    name: z.string().min(1, 'اسم الإدخال مطلوب').max(255),
    description: z.string().optional().nullable(),
    categoryId: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val).pipe(z.number().int().positive('القسم مطلوب')),
    governorateId: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val).pipe(z.number().int().positive('المحافظة مطلوبة')),
    phone: z.string().max(30).optional().nullable(),
    whatsapp: z.string().max(30).optional().nullable(),
    email: z.string().email('إيميل غير صالح').max(150).optional().nullable(),
    website: z.string().max(255).optional().nullable(),
    instagram: z.string().max(150).optional().nullable(),
    facebook: z.string().max(150).optional().nullable(),
    tiktok: z.string().max(150).optional().nullable(),
    locationLat: z.number().min(-90).max(90).optional().nullable(),
    locationLng: z.number().min(-180).max(180).optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    isFeatured: z.union([z.boolean(), z.string()]).transform(val => val === true || val === 'true').optional().default(false),
    isActive: z.union([z.boolean(), z.string()]).transform(val => val !== false && val !== 'false').optional().default(true),
    images: z.array(z.string().min(1, 'رابط الصورة غير صالح')).min(1, 'يجب رفع صورة واحدة على الأقل').optional(),
});

export const updateListingDto = z.object({
    name: z.string().min(1, 'اسم الإدخال مطلوب').max(255).optional(),
    description: z.string().optional().nullable(),
    categoryId: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val).pipe(z.number().int().positive('القسم مطلوب')).optional(),
    governorateId: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val).pipe(z.number().int().positive('المحافظة مطلوبة')).optional(),
    phone: z.string().max(30).optional().nullable(),
    whatsapp: z.string().max(30).optional().nullable(),
    email: z.string().email('إيميل غير صالح').max(150).optional().nullable(),
    website: z.string().max(255).optional().nullable(),
    instagram: z.string().max(150).optional().nullable(),
    facebook: z.string().max(150).optional().nullable(),
    tiktok: z.string().max(150).optional().nullable(),
    locationLat: z.number().min(-90).max(90).optional().nullable(),
    locationLng: z.number().min(-180).max(180).optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    isFeatured: z.union([z.boolean(), z.string()]).transform(val => val === true || val === 'true').optional(),
    isActive: z.union([z.boolean(), z.string()]).transform(val => val !== false && val !== 'false').optional(),
    images: z.array(z.string().min(1, 'رابط الصورة غير صالح')).optional(),
});

export const listingQueryDto = z.object({
    categoryId: z.string().optional(),
    governorateId: z.string().optional(),
    search: z.string().optional(),
    featured: z.string().optional(),
    sort: z.enum(['latest', 'popular']).optional().default('latest'),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    isActive: z.string().optional(),
    isFeatured: z.string().optional(),
});

export type CreateListingDto = z.infer<typeof createListingDto>;
export type UpdateListingDto = z.infer<typeof updateListingDto>;
export type ListingQueryDto = z.infer<typeof listingQueryDto>;
