import { Router } from 'express';
import { reviewController } from '../controllers/reviewController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/bakery/:bakeryId', (req, res, next) => reviewController.getBakeryReviews(req, res, next));
router.post('/', requireAuth, requireRole('CUSTOMER', 'ADMIN'), (req, res, next) => reviewController.create(req, res, next));
router.post('/:id/reply', requireAuth, requireRole('BAKERY'), (req, res, next) => reviewController.reply(req, res, next));

export default router;
