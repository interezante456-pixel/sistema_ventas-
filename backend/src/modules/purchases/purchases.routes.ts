import { Router } from 'express';
import { getPurchases, getPurchaseById, createPurchase } from './purchases.controller';

const router = Router();

router.get('/', getPurchases);
router.post('/', createPurchase);
router.get('/:id', getPurchaseById);

export default router;
