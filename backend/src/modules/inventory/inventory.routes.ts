import { Router } from 'express';
import { getKardex, createAdjustment } from './inventory.controller';

const router = Router();

router.get('/kardex', getKardex);
router.post('/adjustment', createAdjustment);

export default router;
