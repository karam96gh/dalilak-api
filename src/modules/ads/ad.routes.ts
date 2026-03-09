import { Router } from 'express';
import { AdController } from './ad.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createAdDto, updateAdDto } from './ad.dto';

const router = Router();
const controller = new AdController();

// Public routes
router.get('/', controller.getActive);

export default router;

// Admin routes
export const adminAdRouter = Router();
adminAdRouter.use(authMiddleware);
adminAdRouter.get('/', controller.getAll);
adminAdRouter.post('/', validate(createAdDto), controller.create);
adminAdRouter.put('/:id', validate(updateAdDto), controller.update);
adminAdRouter.delete('/:id', controller.delete);
adminAdRouter.post('/reorder', controller.reorder);
