"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
class SalesService {
    async getAll() {
        return await prisma_1.default.venta.findMany({
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
    async getById(id) {
        return await prisma_1.default.venta.findUnique({
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
    async create(data) {
        return await prisma_1.default.$transaction(async (tx) => {
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
                        tipo: client_1.TipoMovimiento.SALIDA,
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
exports.default = new SalesService();
