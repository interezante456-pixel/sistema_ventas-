import { Request, Response } from 'express';
import categoriesService from './categories.service';

class CategoriesController {
    async getAll(req: Request, res: Response) {
        const categories = await categoriesService.getAll();
        res.json(categories);
    }

    async create(req: Request, res: Response) {
        const category = await categoriesService.create(req.body);
        res.status(201).json(category);
    }

    async update(req: Request, res: Response) {
        const category = await categoriesService.update(Number(req.params.id), req.body);
        res.json(category);
    }

    async delete(req: Request, res: Response) {
        await categoriesService.delete(Number(req.params.id));
        res.json({ message: 'Category deleted' });
    }
}

export default new CategoriesController();
