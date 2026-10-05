import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Customer actions
router.post('/', requireAuth, requireRole('CUSTOMER', 'ADMIN'), (req, res, next) => orderController.create(req, res, next));
router.get('/my-orders', requireAuth, (req, res, next) => orderController.getMyOrders(req, res, next));

// Bakery actions
router.get('/bakery/dashboard', requireAuth, requireRole('BAKERY'), (req, res, next) => orderController.getBakeryDashboard(req, res, next));
router.get('/bakery/orders', requireAuth, requireRole('BAKERY'), (req, res, next) => orderController.getBakeryOrders(req, res, next));
router.patch('/:id/status', requireAuth, requireRole('BAKERY', 'ADMIN'), (req, res, next) => orderController.updateStatus(req, res, next));

// Common order details
router.get('/:id', requireAuth, (req, res, next) => orderController.getOne(req, res, next));

export default router;
