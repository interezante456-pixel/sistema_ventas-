import { Router } from 'express';
import usersController from './users.controller';
import { verifyToken } from '../../middlewares/auth';

const router = Router();

router.use(verifyToken); // Protect all user routes

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.patch('/:id', usersController.update);

export default router;
