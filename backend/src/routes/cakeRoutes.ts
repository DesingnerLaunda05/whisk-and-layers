import { Router } from 'express';
import { cakeController } from '../controllers/cakeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.get('/categories', (req, res, next) => cakeController.getCategories(req, res, next));
router.get('/', (req, res, next) => cakeController.getAll(req, res, next));
router.get('/:idOrSlug', (req, res, next) => cakeController.getOne(req, res, next));

// Bakery management
router.post('/', requireAuth, requireRole('BAKERY'), (req, res, next) => cakeController.create(req, res, next));
router.put('/:id', requireAuth, requireRole('BAKERY'), (req, res, next) => cakeController.update(req, res, next));
router.delete('/:id', requireAuth, requireRole('BAKERY'), (req, res, next) => cakeController.delete(req, res, next));

export default router;
