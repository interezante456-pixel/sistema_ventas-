import { Router } from 'express';
import productsController from './products.controller';
import { verifyToken } from '../../middlewares/auth';
import { upload } from '../../middlewares/upload'; 

const router = Router();

router.use(verifyToken);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

// 👇 ¡ESTAS SON LAS LÍNEAS CLAVE! 
// Asegúrate de NO tener ningún otro "router.post" o "router.patch" antes de estas.
router.post('/', upload.single('imagen'), productsController.create);
router.patch('/:id', upload.single('imagen'), productsController.update);

router.delete('/:id', productsController.delete);

export default router;