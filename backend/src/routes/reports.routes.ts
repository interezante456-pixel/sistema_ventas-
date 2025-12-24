import { Router } from 'express';
import { getSalesRegister, getInventoryValuation, getBalanceSheet } from '../controllers/reports.controller';

const router = Router();

router.get('/sales-register', getSalesRegister);
router.get('/inventory-valuation', getInventoryValuation);
router.get('/balance-sheet', getBalanceSheet);

export default router;
