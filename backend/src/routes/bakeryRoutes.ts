import { Router } from 'express';
import { bakeryController } from '../controllers/bakeryController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Public discovery
router.get('/', (req, res, next) => bakeryController.getAll(req, res, next));
router.get('/my-bakery', requireAuth, requireRole('BAKERY'), (req, res, next) => bakeryController.getMyBakery(req, res, next));
router.put('/my-bakery', requireAuth, requireRole('BAKERY'), (req, res, next) => bakeryController.updateMyBakery(req, res, next));
router.get('/:idOrSlug', (req, res, next) => bakeryController.getOne(req, res, next));

export default router;
