import { Router } from 'express';
import { AdminUtilsController } from './admin-utils.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AdminUtilsController();

// All routes require authentication
router.use(authMiddleware);

// Health check (public, no auth needed)
router.get('/health', controller.healthCheck);

// Admin only routes
router.post('/reset-database', controller.resetDatabase);
router.get('/stats', controller.getDatabaseStats);

export default router;
