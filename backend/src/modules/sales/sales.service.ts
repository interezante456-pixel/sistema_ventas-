import prisma from '../../config/prisma';
import { TipoComprobante, MetodoPago, TipoMovimiento, Prisma } from '@prisma/client';

interface VentaDetalleInput {
    productoId: number;
    cantidad: number;
    precio: number;
    descuento?: number;
    subtotal: number;
}

interface CreateVentaInput {
    tipoComprobante: TipoComprobante;
    usuarioId: number;
    clienteId?: number;
    total: number;
    detalles: VentaDetalleInput[];
    metodoPago: MetodoPago;
    montoPago: number; // For the Pago record
}

class SalesService {
    async getAll() {
        return await prisma.venta.findMany({
            include: {
                cliente: true,
                usuario: true,
                detalles: {
                    include: { producto: true },
                },
                pagos: true,
            },
            orderBy: { fechaVenta: 'desc' },
        });
    }

    async getById(id: number) {
        return await prisma.venta.findUnique({
            where: { id },
            include: {
                cliente: true,
                usuario: true,
                detalles: {
                    include: { producto: true },
                },
                pagos: true,
            },
        });
    }

    async create(data: CreateVentaInput) {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Create Venta
            const venta = await tx.venta.create({
                data: {
                    tipoComprobante: data.tipoComprobante,
                    total: data.total,
                    usuarioId: data.usuarioId,
                    clienteId: data.clienteId,
                    fechaVenta: new Date(),
                },
            });

            // 2. Create Detalles
            for (const item of data.detalles) {
                await tx.ventaDetalle.create({
                    data: {
                        ventaId: venta.id,
                        productoId: item.productoId,
                        cantidad: item.cantidad,
                        precio: item.precio,
                        descuento: item.descuento || 0,
                        subtotal: item.subtotal,
                    },
                });

                // 3. Update Stock and Create Movement
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: { stock: { decrement: item.cantidad } },
                });

                await tx.movimientoStock.create({
                    data: {
                        tipo: TipoMovimiento.SALIDA,
                        cantidad: item.cantidad,
                        motivo: `Venta #${venta.id}`,
                        productoId: item.productoId,
                    },
                });
            }

            // 4. Create Pago
            await tx.pago.create({
                data: {
                    ventaId: venta.id,
                    metodoPago: data.metodoPago,
                    monto: data.montoPago,
                },
            });

            return venta;
        });
    }
}

export default new SalesService();
