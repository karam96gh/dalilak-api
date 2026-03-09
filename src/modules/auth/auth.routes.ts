import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { authLimiter } from '../../middleware/rateLimit.middleware';
import { loginDto } from './auth.dto';

const router = Router();
const controller = new AuthController();

router.post('/login', authLimiter, validate(loginDto), controller.login);
router.post('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.me);

export default router;
