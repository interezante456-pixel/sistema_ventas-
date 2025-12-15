import { Request, Response } from 'express';
import usersService from './users.service';

class UsersController {
    async getAll(req: Request, res: Response) {
        try {
            const users = await usersService.getAll();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const user = await usersService.getById(Number(req.params.id));
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const user = await usersService.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const user = await usersService.update(Number(req.params.id), req.body);
            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await usersService.delete(Number(req.params.id));
            res.json({ message: 'User deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UsersController();
