import { Router } from 'express';
import clientsController from './clients.controller';
import { verifyToken } from '../../middlewares/auth';
import consultasController from './consultas.controller';

const router = Router();

// Protegemos todas las rutas con autenticación
router.use(verifyToken);

// Rutas de Consultas Externas (DNI/RUC)
router.get('/consult/dni/:dni', consultasController.consultDni.bind(consultasController));
router.get('/consult/ruc/:ruc', consultasController.consultRuc.bind(consultasController));

// Rutas CRUD Clientes
router.get('/', clientsController.getAll);
router.get('/:id', clientsController.getById);
router.post('/', clientsController.create);
router.put('/:id', clientsController.update); // Changed from patch to put
router.delete('/:id', clientsController.delete);

export default router;