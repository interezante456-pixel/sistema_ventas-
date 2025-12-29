import prisma from '../../config/prisma';

class DashboardService {

    // Helper para rangos de fecha
    private getDateRange(month?: number, year?: number) {
        const now = new Date();
        const y = year || now.getFullYear();
        const m = month !== undefined ? month : now.getMonth(); // 0-indexed

        const start = new Date(y, m, 1);
        const end = new Date(y, m + 1, 0); // Último día del mes
        end.setHours(23, 59, 59, 999);
        
        return { start, end };
    }

    // 1. Obtener Estadísticas Financieras (Cards) - Filtrado por Mes/Año
    async getStats(userId?: number, month?: number, year?: number) {
        const { start, end } = this.getDateRange(month, year);

        const whereClause: any = {
            fechaVenta: { gte: start, lte: end },
            estado: 'COMPLETADO'
        };

        if (userId) {
            whereClause.usuarioId = userId;
        }

        // Ventas del Periodo
        const salesPeriod = await prisma.venta.aggregate({
            _sum: { total: true },
            _count: { id: true },
            where: whereClause
        });

        // NOTA: 'newClients' y 'lowStock' a veces se prefieren ver globales, no del mes.
        // El usuario pidió "lo que se vendió en un mes".
        // Mantendremos 'lowStock' global. 'newClients' lo filtraremos por fecha de creación si el modelo lo permite, 
        // o si no (como no tenemos fechaCreacion en cliente en este contexto), lo dejamos global o contamos clientes únicos que compraron en el mes.
        // Voy a contar clientes únicos que compraron en este periodo (Clientes Activos del Mes).

        const uniqueClients = await prisma.venta.groupBy({
            by: ['clienteId'],
            where: {
                ...whereClause,
                clienteId: { not: null }
            }
        });

        // 5. Total Compras (Gastos en Mercadería del mes)
        const totalPurchases = await prisma.compra.aggregate({
            _sum: { total: true },
            where: {
                fechaCompra: { gte: start, lte: end }
            }
        });

        // 6. Ganancia Líquida Estimada (Ventas - Costos)
        // Necesitamos recorrer los detalles de venta del periodo para sumar (precio - costo) * cantidad
        // Como Prisma no tiene un "computed field" fácil en aggregate para operaciones aritméticas complejas a nivel BD sin raw query,
        // haremos una consulta agrupada o raw.
        // Usaremos findMany con select específico para minimizar carga.
        
        const details = await prisma.ventaDetalle.findMany({
            where: {
                venta: whereClause
            },
            select: {
                cantidad: true,
                subtotal: true,
                costoUnitario: true
            }
        });

        let totalCost = 0;
        let totalRevenue = 0; 
        
        details.forEach(d => {
            const cost = Number(d.costoUnitario || 0); // Si es 0 (antiguos), ganancia será 100% (o deberíamos usar precio actual?) -> Usamos 0 por ahora.
            const qty = d.cantidad;
            totalCost += cost * qty;
            totalRevenue += Number(d.subtotal); 
        });

        const netProfit = totalRevenue - totalCost;

        // Stock Bajo (Siempre global)
        const lowStock = await prisma.producto.count({
            where: {
                stock: { lte: 10 },
                estado: true
            }
        });

        return {
            salesTotal: Number(salesPeriod._sum.total || 0),
            ordersCount: salesPeriod._count.id || 0,
            activeClients: uniqueClients.length,
            lowStock: lowStock,
            totalPurchases: Number(totalPurchases._sum.total || 0),
            netProfit: netProfit
        };
    }

    // 2. Tendencia de Ventas (Últimos 7 días) - Esto puede quedar fijo o filtrarse.
    // Lo dejaremos fijo "Semanal" como 'Recent Trend'.
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

    // 3. Ventas Anuales (Line Chart)
    async getYearlySales(year: number, userId?: number) {
        const data = [];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        for (let i = 0; i < 12; i++) {
            const start = new Date(year, i, 1);
            const end = new Date(year, i + 1, 0);
            end.setHours(23, 59, 59, 999);

            const whereClause: any = {
                fechaVenta: { gte: start, lte: end },
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
                name: months[i],
                ventas: Number(sales._sum.total || 0)
            });
        }
        return data;
    }

    // 4. Productos Más Vendidos (Filtrado por periodo)
    async getTopProducts(userId?: number, month?: number, year?: number) {
        const { start, end } = this.getDateRange(month, year);
        
        let whereVenta = { 
            estado: 'COMPLETADO',
            fechaVenta: { gte: start, lte: end }
        } as any;
        
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

    // 5. Clientes Frecuentes (Filtrado por periodo)
    async getTopClients(userId?: number, month?: number, year?: number) {
        const { start, end } = this.getDateRange(month, year);

        const whereClause: any = {
            clienteId: { not: null },
            estado: 'COMPLETADO',
            fechaVenta: { gte: start, lte: end }
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
        // Las ventas recientes siempre son las últimas globales, no del mes histórico.
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
    async getDashboardData(userId?: number, month?: number, year?: number) {
        // Defaults
        const currentYear = new Date().getFullYear();
        const queryYear = year || currentYear;

        const [stats, salesTrend, yearlySales, topProducts, topClients, recentSales] = await Promise.all([
            this.getStats(userId, month, queryYear),
            this.getSalesTrend(userId),
            this.getYearlySales(queryYear, userId),
            this.getTopProducts(userId, month, queryYear),
            this.getTopClients(userId, month, queryYear),
            this.getRecentSales(userId)
        ]);

        return {
            stats,
            salesTrend,
            yearlySales,
            topProducts,
            topClients,
            recentSales
        };
    }

    // 7. Datos para Dashboard de Almacén
    async getWarehouseStats() {
        // 1. Valor Total del Inventario
        // Calculado como SUM(stock * precioCompra)
        const inventoryValue = await prisma.producto.aggregate({
            _sum: {
                precioCompra: true, 
                stock: true
            }
        });
        
        // Iteración optimizada para valor exacto
        const allProducts = await prisma.producto.findMany({
            select: { stock: true, precioCompra: true, estado: true, categoria: { select: { nombre: true } } },
            where: { estado: true }
        });
        
        let totalValue = 0;
        const categoryMap = new Map<string, number>();

        allProducts.forEach((curr) => {
            const val = curr.stock * Number(curr.precioCompra);
            totalValue += val;

            // Category Distribution Calculation
            const catName = curr.categoria?.nombre || 'Sin Categoría';
             categoryMap.set(catName, (categoryMap.get(catName) || 0) + val);
        });

        const totalProducts = allProducts.length;

        // 2. Stock Bajo Crítico (<= 5)
        const criticalStock = await prisma.producto.count({
            where: { stock: { lte: 5 }, estado: true }
        });

        // 3. Movimientos de Hoy
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const movementsToday = await prisma.movimientoStock.count({
            where: {
                fecha: { gte: startOfDay, lte: endOfDay }
            }
        });

        // 4. Últimos Movimientos
        const recentMovements = await prisma.movimientoStock.findMany({
            take: 7,
            orderBy: { fecha: 'desc' },
            include: {
                producto: {
                    select: { nombre: true, codigo: true }
                }
            }
        });

        // 5. Tendencia de Movimientos (Últimos 7 días)
        const movementsTrend = [];
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startStr = date.toISOString().split('T')[0];
            const start = new Date(startStr);
            start.setHours(0,0,0,0);
            const end = new Date(startStr);
            end.setHours(23,59,59,999);

            const moves = await prisma.movimientoStock.groupBy({
                by: ['tipo'],
                _sum: { cantidad: true },
                where: {
                    fecha: { gte: start, lte: end }
                }
            });

            const entrada = moves.find(m => m.tipo === 'ENTRADA')?._sum.cantidad || 0;
            const salida = moves.find(m => m.tipo === 'SALIDA')?._sum.cantidad || 0;

            movementsTrend.push({
                name: diasSemana[start.getDay()],
                Entrada: entrada,
                Salida: salida
            });
        }

        // Format Category Stats
        const categoryStats = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Tob 5 categories by value

        return {
            totalValue,
            totalProducts,
            criticalStock,
            movementsToday,
            movementsTrend,
            categoryStats,
            recentMovements: recentMovements.map(m => ({
                id: m.id,
                product: m.producto.nombre,
                type: m.tipo,
                quantity: m.cantidad,
                date: m.fecha,
                reason: m.motivo
            }))
        };
    }
}

export default new DashboardService();
