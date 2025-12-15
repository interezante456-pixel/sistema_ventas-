import { Request, Response } from 'express';
import salesService from './sales.service';

class SalesController {
    async getAll(req: Request, res: Response) {
        try {
            const sales = await salesService.getAll();
            res.json(sales);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const sale = await salesService.getById(Number(req.params.id));
            if (!sale) return res.status(404).json({ error: 'Sale not found' });
            res.json(sale);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            // Ensure usuarioId is attached from the token/session
            const data = { ...req.body, usuarioId: (req as any).user.id };
            const sale = await salesService.create(data);
            res.status(201).json(sale);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new SalesController();
