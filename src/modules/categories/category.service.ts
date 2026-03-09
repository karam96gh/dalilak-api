import prisma from '../../config/database';
import { ApiError } from '../../utils/ApiError';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export class CategoryService {
    // Public: get root categories (level=1)
    async getRootCategories() {
        return prisma.category.findMany({
            where: { parentId: null, isActive: true },
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { children: true, listings: true } },
            },
        });
    }

    // Public: get children of a category
    async getChildren(parentId: number) {
        const parent = await prisma.category.findUnique({ where: { id: parentId } });
        if (!parent) throw ApiError.notFound('القسم غير موجود');

        return prisma.category.findMany({
            where: { parentId, isActive: true },
            orderBy: { order: 'asc' },
            include: {
                _count: { select: { children: true, listings: true } },
            },
        });
    }

    // Public: get single category with breadcrumb
    async getById(id: number) {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                    include: { _count: { select: { children: true, listings: true } } },
                },
                _count: { select: { listings: true } },
            },
        });

        if (!category) throw ApiError.notFound('القسم غير موجود');

        // Build breadcrumb
        const breadcrumb = await this.buildBreadcrumb(category.id);

        return { ...category, breadcrumb };
    }

    // Admin: get all categories as tree
    async getAllTree() {
        const categories = await prisma.category.findMany({
            orderBy: [{ level: 'asc' }, { order: 'asc' }],
            include: {
                _count: { select: { children: true, listings: true } },
            },
        });

        // Organize into tree
        return this.buildTree(categories);
    }

    // Admin: create
    async create(data: CreateCategoryDto) {
        let level = 1;

        if (data.parentId) {
            const parent = await prisma.category.findUnique({
                where: { id: data.parentId },
            });
            if (!parent) throw ApiError.notFound('القسم الأب غير موجود');
            if (parent.level >= 3) throw ApiError.badRequest('لا يمكن إضافة أكثر من 3 مستويات');
            level = parent.level + 1;
        }

        return prisma.category.create({
            data: { ...data, level },
        });
    }

    // Admin: update
    async update(id: number, data: UpdateCategoryDto) {
        const existing = await prisma.category.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('القسم غير موجود');

        let level = existing.level;
        if (data.parentId !== undefined) {
            if (data.parentId === null) {
                level = 1;
            } else {
                if (data.parentId === id) throw ApiError.badRequest('لا يمكن جعل القسم أباً لنفسه');
                const parent = await prisma.category.findUnique({
                    where: { id: data.parentId },
                });
                if (!parent) throw ApiError.notFound('القسم الأب غير موجود');
                if (parent.level >= 3) throw ApiError.badRequest('لا يمكن إضافة أكثر من 3 مستويات');
                level = parent.level + 1;
            }
        }

        return prisma.category.update({
            where: { id },
            data: { ...data, level },
        });
    }

    // Admin: delete
    async delete(id: number) {
        const existing = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { children: true, listings: true } } },
        });
        if (!existing) throw ApiError.notFound('القسم غير موجود');

        if (existing._count.children > 0) {
            throw ApiError.badRequest('لا يمكن حذف قسم يحتوي على أقسام فرعية');
        }

        if (existing._count.listings > 0) {
            throw ApiError.badRequest('لا يمكن حذف قسم يحتوي على إدخالات');
        }

        return prisma.category.delete({ where: { id } });
    }

    // Helper: build breadcrumb
    private async buildBreadcrumb(categoryId: number): Promise<string[]> {
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

    // Helper: build tree from flat list
    private buildTree(categories: any[]): any[] {
        const map = new Map();
        const roots: any[] = [];

        categories.forEach((cat) => {
            map.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach((cat) => {
            const node = map.get(cat.id);
            if (cat.parentId && map.has(cat.parentId)) {
                map.get(cat.parentId).children.push(node);
            } else if (!cat.parentId) {
                roots.push(node);
            }
        });

        return roots;
    }
}
