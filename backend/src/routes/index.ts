import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/users.routes';
import categoryRoutes from '../modules/categories/categories.routes';
import productRoutes from '../modules/products/products.routes';
import saleRoutes from '../modules/sales/sales.routes';
import clientRoutes from '../modules/clients/clients.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

import reportsRoutes from './reports.routes';
import providerRoutes from '../modules/providers/providers.routes';
import purchaseRoutes from '../modules/purchases/purchases.routes';
import inventoryRoutes from '../modules/inventory/inventory.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/clients', clientRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);
router.use('/providers', providerRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/inventory', inventoryRoutes);

export default router;
