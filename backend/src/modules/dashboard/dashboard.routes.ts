import { Router } from 'express';
import dashboardController from './dashboard.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.use(verifyToken);

router.get('/', dashboardController.getData);
router.get('/low-stock', dashboardController.getLowStockDetails);

export default router;
