import { Router } from 'express';
import { customizationController } from '../controllers/customizationController.js';

const router = Router();

router.get('/options', (req, res, next) => customizationController.getOptions(req, res, next));
router.post('/calculate', (req, res, next) => customizationController.calculatePrice(req, res, next));

export default router;
