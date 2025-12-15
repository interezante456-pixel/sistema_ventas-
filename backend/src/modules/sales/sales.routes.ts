import { Router } from 'express';
import salesController from './sales.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.use(verifyToken);

router.get('/', salesController.getAll);
router.get('/:id', salesController.getById);
router.post('/', salesController.create);

export default router;
