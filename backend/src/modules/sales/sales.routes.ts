import { Router } from 'express';
import salesController from './sales.controller';
import { verifyToken } from '../../middlewares/auth';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.use(verifyToken);

router.get('/', salesController.getAll);
router.get('/:id', salesController.getById);
router.post('/', salesController.create);
router.patch('/:id/cancel', salesController.cancel); // Nueva ruta para anular
router.post('/:id/email', upload.single('pdf'), salesController.sendTicketEmail);

export default router;