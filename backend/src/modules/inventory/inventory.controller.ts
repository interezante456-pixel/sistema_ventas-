import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// Obtener historial de movimientos (Kardex)
export const getKardex = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, productoId, tipo } = req.query;

        const whereClause: any = {};

        // Filtro por fecha
        if (startDate && endDate) {
            whereClause.fecha = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            };
        }

        // Filtro por producto
        if (productoId) {
            whereClause.productoId = Number(productoId);
        }

        // Filtro por tipo (ENTRADA / SALIDA)
        if (tipo) {
            whereClause.tipo = String(tipo);
        }

        const movimientos = await prisma.movimientoStock.findMany({
            where: whereClause,
            include: {
                producto: {
                    select: {
                        codigo: true,
                        nombre: true,
                        imagenUrl: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            }
        });

        res.json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener kardex' });
    }
};

// Crear un ajuste manual de inventario
export const createAdjustment = async (req: Request, res: Response) => {
    try {
        const { productoId, tipo, cantidad, motivo } = req.body;
        // tipo: 'ENTRADA' | 'SALIDA'
        // cantidad: number (positivo)

        const qty = Number(cantidad);
        if (qty <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear Movimiento
            const movimiento = await tx.movimientoStock.create({
                data: {
                    tipo: tipo, // 'ENTRADA' o 'SALIDA'
                    cantidad: qty,
                    motivo: motivo || 'Ajuste Manual de Inventario',
                    productoId: Number(productoId),
                    fecha: new Date()
                }
            });

            // 2. Actualizar Stock del Producto
            if (tipo === 'ENTRADA') {
                await tx.producto.update({
                    where: { id: Number(productoId) },
                    data: { stock: { increment: qty } }
                });
            } else {
                // Verificar stock suficiente si es salida
                const producto = await tx.producto.findUnique({ where: { id: Number(productoId) } });
                if (!producto || producto.stock < qty) {
                    throw new Error(`Stock insuficiente. Stock actual: ${producto?.stock || 0}`);
                }

                await tx.producto.update({
                    where: { id: Number(productoId) },
                    data: { stock: { decrement: qty } }
                });
            }

            return movimiento;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Error al crear ajuste' });
    }
};
