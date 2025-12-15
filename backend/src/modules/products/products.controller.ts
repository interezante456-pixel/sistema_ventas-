import { Request, Response } from 'express';
import productsService from './products.service';

class ProductsController {
    async getAll(req: Request, res: Response) {
        try {
            const products = await productsService.getAll();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const product = await productsService.getById(Number(req.params.id));
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const product = await productsService.create(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const product = await productsService.update(Number(req.params.id), req.body);
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await productsService.delete(Number(req.params.id));
            res.json({ message: 'Product deleted' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductsController();
