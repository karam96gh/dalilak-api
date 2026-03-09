import { Router } from 'express';
import { GovernorateController } from './governorate.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createGovernorateDto, updateGovernorateDto } from './governorate.dto';

const router = Router();
const controller = new GovernorateController();

// Public routes
router.get('/', controller.getAll);

export default router;

// Admin routes
export const adminGovernorateRouter = Router();
adminGovernorateRouter.use(authMiddleware);
adminGovernorateRouter.get('/', controller.getAllAdmin);
adminGovernorateRouter.post('/', validate(createGovernorateDto), controller.create);
adminGovernorateRouter.put('/:id', validate(updateGovernorateDto), controller.update);
adminGovernorateRouter.delete('/:id', controller.delete);
