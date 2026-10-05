import { Router } from 'express';
import authRoutes from './authRoutes.js';
import bakeryRoutes from './bakeryRoutes.js';
import cakeRoutes from './cakeRoutes.js';
import customizationRoutes from './customizationRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import healthRoutes from './healthRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/bakeries', bakeryRoutes);
apiRouter.use('/cakes', cakeRoutes);
apiRouter.use('/customizations', customizationRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/health', healthRoutes);

export default apiRouter;
