import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all admin routes
router.use(requireAuth, requireRole('ADMIN'));

router.get('/metrics', (req, res, next) => adminController.getMetrics(req, res, next));
router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.get('/bakeries', (req, res, next) => adminController.getBakeries(req, res, next));
router.get('/orders', (req, res, next) => adminController.getOrders(req, res, next));
router.patch('/bakeries/:id/approval', (req, res, next) => adminController.toggleBakeryApproval(req, res, next));
router.patch('/users/:id/status', (req, res, next) => adminController.toggleUserStatus(req, res, next));

export default router;
