import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', requireAuth, upload.single('image'), (req, res, next) => {
  uploadController.uploadFile(req, res, next);
});

export default router;
