import { Router } from 'express';
import clientsController from './clients.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

// Protegemos todas las rutas con autenticación
router.use(verifyToken);

router.get('/', clientsController.getAll);
router.get('/:id', clientsController.getById);
router.post('/', clientsController.create);
router.patch('/:id', clientsController.update);
router.delete('/:id', clientsController.delete);

export default router;