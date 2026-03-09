import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createCategoryDto, updateCategoryDto } from './category.dto';

const router = Router();
const controller = new CategoryController();

// Public routes
router.get('/', controller.getRootCategories);
router.get('/:id', controller.getById);
router.get('/:id/children', controller.getChildren);

export default router;

// Admin routes
export const adminCategoryRouter = Router();
adminCategoryRouter.use(authMiddleware);
adminCategoryRouter.get('/', controller.getAllTree);
adminCategoryRouter.post('/', validate(createCategoryDto), controller.create);
adminCategoryRouter.put('/:id', validate(updateCategoryDto), controller.update);
adminCategoryRouter.delete('/:id', controller.delete);
