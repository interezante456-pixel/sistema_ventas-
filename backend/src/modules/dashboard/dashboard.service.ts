import prisma from '../../config/prisma';

class DashboardService {

    // 1. Obtener Estadísticas Generales (Cards)
    async getStats(userId?: number) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const whereClause: any = {
            fechaVenta: { gte: startOfDay, lt: endOfDay },
            estado: 'COMPLETADO'
        };

        if (userId) {
            whereClause.usuarioId = userId;
        }

        // Ventas de Hoy
        const salesToday = await prisma.venta.aggregate({
            _sum: { total: true },
            _count: { id: true },
            where: whereClause
        });

        // Clientes Nuevos 
        // Si tienes usuarioId, la lógica de clientes nuevos podría variar. 
        // Asumiremos que cuenta clientes globales o asignados si existiera esa relación.
        // Por ahora lo dejamos global o ajustamos si Cliente tiene usuarioId creador.
        // Dado que el esquema no vincula Cliente con Usuario explícitamente en creación (a ver schema),
        // mantenemos conteo global o devolvemos 0 si se requiere estricto.
        const newClients = await prisma.cliente.count({
            // where: userId ? { usuarioId: userId } : {} // Si existiera
        });

        // Stock Bajo (Siempre global, el vendedor necesita saber si hay stock para vender)
        const lowStock = await prisma.producto.count({
            where: {
                stock: { lte: 10 },
                estado: true
            }
        });

        return {
            salesToday: Number(salesToday._sum.total || 0),
            ordersToday: salesToday._count.id || 0,
            clientsTotal: newClients,
            lowStock: lowStock
        };
    }

    // 2. Tendencia de Ventas (Últimos 7 días)
    async getSalesTrend(userId?: number) {
        const data = [];
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startStr = date.toISOString().split('T')[0];

            const start = new Date(startStr);
            const end = new Date(startStr);
            end.setDate(end.getDate() + 1);

            const whereClause: any = {
                fechaVenta: { gte: start, lt: end },
                estado: 'COMPLETADO'
            };

            if (userId) {
                whereClause.usuarioId = userId;
            }

            const sales = await prisma.venta.aggregate({
                _sum: { total: true },
                where: whereClause
            });

            data.push({
                name: diasSemana[date.getDay()],
                ventas: Number(sales._sum.total || 0)
            });
        }
        return data;
    }

    // 3. Productos Más Vendidos
    async getTopProducts(userId?: number) {
        // Para filtrar por usuario en groupBy de detalle, necesitamos filtrar las ventas primero
        // o usar raw query. Prisma groupBy no soporta filtrado por relación (Venta) directamanete fácil.
        // Opción: Buscar ventas del usuario y luego agrupar detalles de esas ventas.

        let whereVenta = { estado: 'COMPLETADO' } as any;
        if (userId) {
            whereVenta.usuarioId = userId;
        }

        const topProducts = await prisma.ventaDetalle.groupBy({
            by: ['productoId'],
            _sum: { cantidad: true },
            where: {
                venta: whereVenta
            },
            orderBy: {
                _sum: {
                    cantidad: 'desc'
                }
            },
            take: 5,
        });

        // Recuperar nombres de productos
        const result = [];
        for (const item of topProducts) {
            const product = await prisma.producto.findUnique({
                where: { id: item.productoId },
                select: { nombre: true }
            });
            if (product) {
                result.push({
                    name: product.nombre,
                    value: Number(item._sum.cantidad || 0)
                });
            }
        }
        return result;
    }

    // 4. Clientes Frecuentes
    async getTopClients(userId?: number) {
        const whereClause: any = {
            clienteId: { not: null },
            estado: 'COMPLETADO'
        };

        if (userId) {
            whereClause.usuarioId = userId;
        }

        const topClients = await prisma.venta.groupBy({
            by: ['clienteId'],
            _sum: { total: true },
            _count: { id: true },
            where: whereClause,
            orderBy: {
                _sum: { total: 'desc' }
            },
            take: 5
        });

        // Obtener nombres
        const result = [];
        for (const item of topClients) {
            if (item.clienteId) {
                const cliente = await prisma.cliente.findUnique({
                    where: { id: item.clienteId },
                    select: { nombres: true }
                });
                if (cliente) {
                    result.push({
                        name: cliente.nombres,
                        purchases: item._count.id,
                        total: `S/ ${Number(item._sum.total || 0).toFixed(2)}`
                    });
                }
            }
        }
        return result;
    }

    // 5. Ventas Recientes
    async getRecentSales(userId?: number) {
        const whereClause: any = {};
        if (userId) {
            whereClause.usuarioId = userId;
        }

        const sales = await prisma.venta.findMany({
            take: 5,
            orderBy: { fechaVenta: 'desc' },
            where: whereClause,
            include: {
                cliente: { select: { nombres: true } }
            }
        });

        return sales.map(s => {
            const clientName = s.cliente ? s.cliente.nombres : 'Público General';
            return {
                id: `#V-${s.id}`,
                client: clientName.trim(),
                amount: `S/ ${s.total.toFixed(2)}`,
                status: s.estado.toLowerCase(),
                date: s.fechaVenta.toISOString()
            };
        });
    }

    // 6. Obtener Detalle de Stock Bajo
    async getLowStockDetails() {
        return await prisma.producto.findMany({
            where: {
                stock: { lte: 10 },
                estado: true
            },
            select: {
                id: true,
                codigo: true,
                nombre: true,
                stock: true,
                precioVenta: true,
                categoria: {
                    select: { nombre: true }
                }
            },
            orderBy: { stock: 'asc' }
        });
    }

    // Método Maestro
    async getDashboardData(userId?: number) {
        const [stats, salesTrend, topProducts, topClients, recentSales] = await Promise.all([
            this.getStats(userId),
            this.getSalesTrend(userId),
            this.getTopProducts(userId),
            this.getTopClients(userId),
            this.getRecentSales(userId)
        ]);

        return {
            stats,
            salesTrend,
            topProducts,
            topClients,
            recentSales
        };
    }
}

export default new DashboardService();
