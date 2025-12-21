import { Router } from 'express';
import productsController from './products.controller';
import { verifyToken } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload';

const router = Router();

router.use(verifyToken);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.post('/', productsController.create);
router.put('/:id', productsController.update);
router.delete('/:id', productsController.delete);

router.post('/', upload.single('imagen'), productsController.create);
router.patch('/:id', upload.single('imagen'), productsController.update);

export default router;
