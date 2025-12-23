import { Request, Response } from 'express';
import dashboardService from './dashboard.service';

class DashboardController {
    async getData(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const role = user?.rol;
            const userId = user?.id;

            // Si es vendedor, filtramos por su ID. Si es otro rol (Admin, etc.), ve todo (pasamos undefined)
            // OJO: Si quieres que CONTADOR vea todo, lo dejas así. Si Contador solo ve finanzas globales, está bien.

            const filterUserId = (role === 'VENDEDOR') ? userId : undefined;

            const data = await dashboardService.getDashboardData(filterUserId);
            res.json(data);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error al obtener datos del dashboard' });
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
