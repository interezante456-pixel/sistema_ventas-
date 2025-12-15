import { Router } from 'express';
import productsController from './products.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.use(verifyToken);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

export default router;
