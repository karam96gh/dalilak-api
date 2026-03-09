import { Router } from 'express';
import { ListingController } from './listing.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createListingDto, updateListingDto } from './listing.dto';

const router = Router();
const controller = new ListingController();

// Public routes
router.get('/', controller.getListings);
router.get('/featured', controller.getFeatured);
router.get('/latest', controller.getLatest);
router.get('/:id', controller.getById);
router.post('/:id/view', controller.incrementView);

export default router;

// Admin routes
export const adminListingRouter = Router();
adminListingRouter.use(authMiddleware);
adminListingRouter.get('/', controller.getAll);
adminListingRouter.post('/', validate(createListingDto), controller.create);
adminListingRouter.put('/:id', validate(updateListingDto), controller.update);
adminListingRouter.delete('/:id', controller.delete);
