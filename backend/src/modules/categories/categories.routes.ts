import { Router } from 'express';
import categoriesController from './categories.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.use(verifyToken);

router.get('/', categoriesController.getAll);
router.post('/', categoriesController.create);
router.put('/:id', categoriesController.update);
router.delete('/:id', categoriesController.delete);
router.get('/:id', categoriesController.getById);
export default router;
