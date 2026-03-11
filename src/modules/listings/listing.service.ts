import { Prisma } from '@prisma/client';
import prisma from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/paginate';
import { CreateListingDto, UpdateListingDto, ListingQueryDto } from './listing.dto';

export class ListingService {
    // Public: get listings with filters
    async getListings(query: ListingQueryDto) {
        const { page, limit, skip } = getPagination(query);

    const where: Prisma.ListingWhereInput = {
            isActive: true,
        };

        if (query.categoryId) {
      const rootId = parseInt(query.categoryId);
      const categoryIds = await this.getCategoryWithDescendantsIds(rootId);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      } else {
        where.categoryId = rootId;
      }
        }

        if (query.governorateId) {
            where.governorateId = parseInt(query.governorateId);
        }

        if (query.featured === 'true') {
            where.isFeatured = true;
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const orderBy: Prisma.ListingOrderByWithRelationInput =
            query.sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' };

        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true } },
                    governorate: { select: { id: true, name: true } },
                    images: { orderBy: { order: 'asc' }, take: 1 },
                },
            }),
            prisma.listing.count({ where }),
        ]);

        return { listings, total, page, limit };
    }

    // Public: featured listings
    async getFeatured() {
        return prisma.listing.findMany({
            where: { isFeatured: true, isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                category: { select: { id: true, name: true } },
                governorate: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' }, take: 1 },
            },
        });
    }

    // Public: latest listings
    async getLatest() {
        return prisma.listing.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                category: { select: { id: true, name: true } },
                governorate: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' }, take: 1 },
            },
        });
    }

    // Public: get single listing with full details
    async getById(id: number) {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true, parentId: true } },
                governorate: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' } },
            },
        });

        if (!listing) throw ApiError.notFound('الإدخال غير موجود');

        // Build category breadcrumb
        const breadcrumb = await this.buildCategoryBreadcrumb(listing.categoryId);

        return {
            ...listing,
            category: {
                ...listing.category,
                breadcrumb,
            },
        };
    }

    // Public: increment view count
    async incrementView(id: number) {
        const listing = await prisma.listing.findUnique({ where: { id } });
        if (!listing) throw ApiError.notFound('الإدخال غير موجود');

        await prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }

    // Public: search
  async search(
    q: string,
    governorateId?: string,
    categoryId?: string,
    page?: string,
    limit?: string,
  ) {
        const pagination = getPagination({ page, limit });

        const where: Prisma.ListingWhereInput = {
            isActive: true,
            OR: [
                { name: { contains: q } },
                { description: { contains: q } },
            ],
        };

        if (governorateId) {
            where.governorateId = parseInt(governorateId);
        }

    if (categoryId) {
      const rootId = parseInt(categoryId);
      const categoryIds = await this.getCategoryWithDescendantsIds(rootId);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      } else {
        where.categoryId = rootId;
      }
    }

        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                orderBy: { viewCount: 'desc' },
                skip: pagination.skip,
                take: pagination.limit,
                include: {
                    category: { select: { id: true, name: true } },
                    governorate: { select: { id: true, name: true } },
                    images: { orderBy: { order: 'asc' }, take: 1 },
                },
            }),
            prisma.listing.count({ where }),
        ]);

        return { listings, total, page: pagination.page, limit: pagination.limit };
    }

    // Admin: get all listings (including inactive)
    async getAll(query: ListingQueryDto) {
        const { page, limit, skip } = getPagination(query);

        const where: Prisma.ListingWhereInput = {};

        if (query.categoryId) where.categoryId = parseInt(query.categoryId);
        if (query.governorateId) where.governorateId = parseInt(query.governorateId);
        if (query.isActive !== undefined && query.isActive !== 'all') {
            where.isActive = query.isActive === 'true';
        }
        if (query.isFeatured !== undefined && query.isFeatured !== 'all') {
            where.isFeatured = query.isFeatured === 'true';
        }
        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const orderBy: Prisma.ListingOrderByWithRelationInput =
            query.sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' };

        const [listings, total] = await Promise.all([
            prisma.listing.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true } },
                    governorate: { select: { id: true, name: true } },
                    images: { orderBy: { order: 'asc' }, take: 1 },
                    _count: { select: { images: true } },
                },
            }),
            prisma.listing.count({ where }),
        ]);

        return { listings, total, page, limit };
    }

    // Admin: create
    async create(data: CreateListingDto) {
        const { images, ...listingData } = data;

        const listing = await prisma.listing.create({
            data: {
                ...listingData,
                images: images
                    ? {
                        create: images.map((url, index) => ({
                            imageUrl: url,
                            order: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: { select: { id: true, name: true } },
                governorate: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' } },
            },
        });

        return listing;
    }

    // Admin: update
    async update(id: number, data: UpdateListingDto) {
        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإدخال غير موجود');

        const { images, ...listingData } = data;

        // If images provided, delete old ones and create new
        if (images) {
            await prisma.listingImage.deleteMany({ where: { listingId: id } });
        }

        const listing = await prisma.listing.update({
            where: { id },
            data: {
                ...listingData,
                images: images
                    ? {
                        create: images.map((url, index) => ({
                            imageUrl: url,
                            order: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: { select: { id: true, name: true } },
                governorate: { select: { id: true, name: true } },
                images: { orderBy: { order: 'asc' } },
            },
        });

        return listing;
    }

    // Admin: delete
    async delete(id: number) {
        const existing = await prisma.listing.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('الإدخال غير موجود');

        await prisma.listing.delete({ where: { id } });
    }

    // Helper
    private async buildCategoryBreadcrumb(categoryId: number): Promise<string[]> {
        const breadcrumb: string[] = [];
        let currentId: number | null = categoryId;

        while (currentId) {
            const cat: { name: string; parentId: number | null } | null = await prisma.category.findUnique({
                where: { id: currentId },
                select: { name: true, parentId: true },
            });
            if (!cat) break;
            breadcrumb.unshift(cat.name);
            currentId = cat.parentId;
        }

        return breadcrumb;
    }

    private async getCategoryWithDescendantsIds(categoryId: number): Promise<number[]> {
        const categories = await prisma.category.findMany({
            where: {
                OR: [
                    { id: categoryId },
                    { parentId: categoryId },
                    { parent: { parentId: categoryId } },
                ],
            },
            select: { id: true },
        });
        return categories.map((c) => c.id);
    }
}
