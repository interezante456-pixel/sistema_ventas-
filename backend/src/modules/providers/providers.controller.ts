import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const getProviders = async (req: Request, res: Response) => {
    try {
        const providers = await prisma.proveedor.findMany({
            where: { estado: true },
            orderBy: { id: 'desc' }
        });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

export const createProvider = async (req: Request, res: Response) => {
    try {
        const { ruc, nombre, telefono, direccion, email } = req.body;

        // Validar RUC único si se proporciona
        if (ruc) {
            const existing = await prisma.proveedor.findUnique({ where: { ruc } });
            if (existing) {
                return res.status(400).json({ error: 'El RUC ya está registrado' });
            }
        }

        const provider = await prisma.proveedor.create({
            data: { ruc, nombre, telefono, direccion, email }
        });

        res.status(201).json(provider);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

export const updateProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { ruc, nombre, telefono, direccion, email } = req.body;

        // Validar unicidad de RUC excluyendo el actual
        if (ruc) {
            const existing = await prisma.proveedor.findFirst({
                where: { 
                    ruc,
                    id: { not: Number(id) }
                }
            });
            if (existing) {
                return res.status(400).json({ error: 'El RUC ya está uso por otro proveedor' });
            }
        }

        const provider = await prisma.proveedor.update({
            where: { id: Number(id) },
            data: { ruc, nombre, telefono, direccion, email }
        });

        res.json(provider);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

export const deleteProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Soft delete
        await prisma.proveedor.update({
            where: { id: Number(id) },
            data: { estado: false }
        });
        res.json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};
