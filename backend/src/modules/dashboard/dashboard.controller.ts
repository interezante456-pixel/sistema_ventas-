import { Request, Response } from 'express';
import dashboardService from './dashboard.service';

class DashboardController {
    async getData(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const role = user?.rol;
            const userId = user?.id;
            
            // Impersonation Logic:
            // Si el usuario es ADMIN/SUPER_ADMIN y envía 'viewUserId', usamos ese ID.
            // Si no envía 'viewUserId', y es ADMIN, ve todo (undefined).
            // Si es VENDEDOR, ve solo lo suyo.
            
            let filterUserId: number | undefined = undefined;

            const viewUserId = req.query.viewUserId ? Number(req.query.viewUserId) : undefined;

            if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
                if (viewUserId) {
                    filterUserId = viewUserId;
                } else {
                    filterUserId = undefined; // Global view
                }
            } else {
                // Vendedor u otros roles restringidos
                filterUserId = userId;
            }
            
            // Parse filters
            const month = req.query.month ? Number(req.query.month) : undefined;
            const year = req.query.year ? Number(req.query.year) : undefined;

            const data = await dashboardService.getDashboardData(filterUserId, month, year);
            res.json(data);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error al obtener datos del dashboard' });
        }
    }

    async getWarehouseData(req: Request, res: Response) {
        try {
            const data = await dashboardService.getWarehouseStats();
            res.json(data);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error al obtener datos de almacén' });
        }
    }

    async getLowStockDetails(req: Request, res: Response) {
        try {
            const products = await dashboardService.getLowStockDetails();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message || 'Error al obtener detalle de stock bajo' });
        }
    }
}

export default new DashboardController();
