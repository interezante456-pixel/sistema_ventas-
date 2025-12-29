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
    montoPago: number;
    referencia?: string; // 👈 NUEVO: Para guardar el N° Operación Yape/Tarjeta
}

class SalesService {
    async getAll(userId?: number) {
        const whereClause: any = {};
        if (userId) {
            whereClause.usuarioId = userId;
        }

        return await prisma.venta.findMany({
            where: whereClause,
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
            // 1. Validar Stock ANTES de crear nada
            for (const item of data.detalles) {
                const producto = await tx.producto.findUnique({ where: { id: item.productoId } });

                if (!producto) throw new Error(`Producto ${item.productoId} no existe`);
                if (!producto.estado) throw new Error(`Producto ${producto.nombre} está desactivado`);
                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`);
                }
            }

            // 2. Crear Venta (Cabecera)
            const venta = await tx.venta.create({
                data: {
                    tipoComprobante: data.tipoComprobante,
                    total: data.total,
                    usuarioId: data.usuarioId,
                    clienteId: data.clienteId,
                    metodoPago: data.metodoPago, // Guardamos método principal en cabecera
                    referencia: data.referencia, // 👈 Guardamos la referencia (Yape/Tarjeta)
                    fechaVenta: new Date(),
                    estado: 'COMPLETADO'
                },
            });

            // 3. Crear Detalles y Mover Stock
            for (const item of data.detalles) {
                // Obtenemos costo actual (lo volvemos a buscar dentro de la tx para asegurar consistencia,
                // aunque ya validamos stock arriba, el precioCompra podría haber cambiado)
                const producto = await tx.producto.findUnique({
                    where: { id: item.productoId },
                    select: { precioCompra: true }
                });

                await tx.ventaDetalle.create({
                    data: {
                        ventaId: venta.id,
                        productoId: item.productoId,
                        cantidad: item.cantidad,
                        precio: item.precio,
                        costoUnitario: producto?.precioCompra || 0, // 👈 Guardamos costo histórico
                        descuento: item.descuento || 0,
                        subtotal: item.subtotal,
                    },
                });

                // Disminuir Stock
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: { stock: { decrement: item.cantidad } },
                });

                // Registrar Kardex (Salida)
                await tx.movimientoStock.create({
                    data: {
                        tipo: TipoMovimiento.SALIDA,
                        cantidad: item.cantidad,
                        motivo: `Venta #${venta.id}`,
                        productoId: item.productoId,
                    },
                });
            }

            // 4. Registrar Pago (Tabla de pagos separada)
            await tx.pago.create({
                data: {
                    ventaId: venta.id,
                    metodoPago: data.metodoPago,
                    monto: data.montoPago,
                    // Opcional: También guardarlo aquí si tu modelo Pago lo tiene
                },
            });

            // 5. 🚀 CRÍTICO: Devolver la venta COMPLETA con relaciones
            // Esto permite que el Frontend genere el PDF inmediatamente sin recargar.
            return await tx.venta.findUnique({
                where: { id: venta.id },
                include: {
                    cliente: true,   // Necesario para nombre del cliente en ticket
                    usuario: true,
                    detalles: {
                        include: {
                            producto: true // Necesario para nombres de productos en ticket
                        },
                    },
                    pagos: true,
                },
            });
        });
    }

    async cancelSale(id: number) {
        return await prisma.$transaction(async (tx) => {
            // 1. Buscar venta
            const venta = await tx.venta.findUnique({
                where: { id },
                include: { detalles: true }
            });

            if (!venta) throw new Error("Venta no encontrada");
            if (venta.estado === 'ANULADO') throw new Error("Esta venta ya fue anulada");

            // 2. Devolver Stock (Reversa)
            for (const detalle of venta.detalles) {
                await tx.producto.update({
                    where: { id: detalle.productoId },
                    data: { stock: { increment: detalle.cantidad } }
                });

                // Registrar Kardex (Entrada por anulación)
                await tx.movimientoStock.create({
                    data: {
                        tipo: TipoMovimiento.ENTRADA,
                        cantidad: detalle.cantidad,
                        motivo: `Anulación Venta #${venta.id}`,
                        productoId: detalle.productoId
                    }
                });
            }

            // 3. Cambiar estado a ANULADO
            return await tx.venta.update({
                where: { id },
                data: { estado: 'ANULADO' }
            });
        });
    }
}

export default new SalesService();