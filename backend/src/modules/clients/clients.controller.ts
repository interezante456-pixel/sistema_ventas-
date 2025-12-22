import { Request, Response } from 'express';
import clientsService from './clients.service';

class ClientsController {

    async getAll(req: Request, res: Response) {
        try {
            const clients = await clientsService.getAll();
            res.json(clients);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const client = await clientsService.getById(Number(id));
            if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
            res.json(client);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { nombres, dniRuc } = req.body;

            // Validaciones básicas
            if (!nombres) return res.status(400).json({ error: 'El nombre es obligatorio' });
            if (!dniRuc) return res.status(400).json({ error: 'El DNI/RUC es obligatorio' });

            // Verificar si ya existe
            const existingClient = await clientsService.getByDniRuc(dniRuc);
            if (existingClient) {
                return res.status(400).json({ error: 'Ya existe un cliente con este DNI/RUC' });
            }

            const newClient = await clientsService.create(req.body);
            res.status(201).json(newClient);
        } catch (error: any) {
            // Error de Prisma por duplicados (backup safety)
            if (error.code === 'P2002') return res.status(400).json({ error: 'DNI/RUC duplicado' });
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const client = await clientsService.update(Number(id), req.body);
            res.json(client);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await clientsService.delete(Number(id));
            res.json({ message: 'Cliente eliminado correctamente' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ClientsController();