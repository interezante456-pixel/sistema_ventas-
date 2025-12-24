import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// Obtener todas las compras
export const getPurchases = async (req: Request, res: Response) => {
    try {
        const purchases = await prisma.compra.findMany({
            include: {
                proveedor: true,
                usuario: true,
                _count: {
                    select: { detalles: true }
                }
            },
            orderBy: {
                fechaCompra: 'desc'
            }
        });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener compras' });
    }
};

// Obtener una compra por ID con detalles
export const getPurchaseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const purchase = await prisma.compra.findUnique({
            where: { id: Number(id) },
            include: {
                proveedor: true,
                usuario: true,
                detalles: {
                    include: {
                        producto: true
                    }
                }
            }
        });

        if (!purchase) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }

        res.json(purchase);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalle de compra' });
    }
};

// Crear nueva compra (Transacción compleja)
export const createPurchase = async (req: Request, res: Response) => {
    try {
        const { proveedorId, usuarioId, detalles, fechaCompra } = req.body;

        // Calcular total global
        const total = detalles.reduce((sum: number, item: any) => sum + (item.cantidad * item.precio), 0);

        // INICIO TRANSACCIÓN
        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear cabecera Compra
            const compra = await tx.compra.create({
                data: {
                    proveedorId: Number(proveedorId),
                    usuarioId: Number(usuarioId),
                    total: total,
                    fechaCompra: fechaCompra ? new Date(fechaCompra) : new Date()
                }
            });

            // 2. Procesar cada detalle
            for (const item of detalles) {
                // Crear detalle de compra
                await tx.compraDetalle.create({
                    data: {
                        compraId: compra.id,
                        productoId: Number(item.productoId),
                        cantidad: Number(item.cantidad),
                        precio: Number(item.precio),
                        subtotal: Number(item.cantidad) * Number(item.precio)
                    }
                });

                // Actualizar Stock y Costo del Producto
                await tx.producto.update({
                    where: { id: Number(item.productoId) },
                    data: {
                        stock: { increment: Number(item.cantidad) },
                        precioCompra: Number(item.precio) // Actualizamos al último costo
                    }
                });

                // Registrar Movimiento en Kardex
                await tx.movimientoStock.create({
                    data: {
                        tipo: 'ENTRADA',
                        cantidad: Number(item.cantidad),
                        motivo: `Compra #${compra.id}`,
                        productoId: Number(item.productoId),
                        fecha: fechaCompra ? new Date(fechaCompra) : new Date()
                    }
                });
            }

            return compra;
        });

        res.status(201).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar la compra' });
    }
};
