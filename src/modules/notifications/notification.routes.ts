import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createNotificationDto, updateNotificationDto } from './notification.dto';

const router = Router();
const controller = new NotificationController();

// Public routes
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

export default router;

// Admin routes
export const adminNotificationRouter = Router();
adminNotificationRouter.use(authMiddleware);
adminNotificationRouter.get('/', controller.getAllAdmin);
adminNotificationRouter.post('/', validate(createNotificationDto), controller.create);
adminNotificationRouter.put('/:id', validate(updateNotificationDto), controller.update);
adminNotificationRouter.delete('/:id', controller.delete);
