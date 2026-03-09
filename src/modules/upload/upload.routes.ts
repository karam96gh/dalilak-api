import { Router } from 'express';
import { UploadController } from './upload.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { upload } from '../../config/multer';

const router = Router();
const controller = new UploadController();

router.use(authMiddleware);
router.post('/image', upload.single('image'), controller.uploadImage);
router.post('/images', upload.array('images', 10), controller.uploadImages);
router.delete('/image', controller.deleteImage);

export default router;
