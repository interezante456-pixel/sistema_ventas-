import { Request, Response } from 'express';
import salesService from './sales.service';

class SalesController {
    async getAll(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const role = user?.rol;
            const userId = user?.id;

            const filterUserId = (role === 'VENDEDOR') ? userId : undefined;

            const sales = await salesService.getAll(filterUserId);
            res.json(sales);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const sale = await salesService.getById(Number(req.params.id));
            if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
            res.json(sale);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Asumimos que el middleware verifyToken agrega el usuario a req
            const userId = (req as any).user.id;
            const data = { ...req.body, usuarioId: userId };

            const sale = await salesService.create(data);
            res.status(201).json(sale);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancel(req: Request, res: Response) {
        try {
            const sale = await salesService.cancelSale(Number(req.params.id));
            res.json({ message: 'Venta anulada correctamente', sale });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new SalesController();