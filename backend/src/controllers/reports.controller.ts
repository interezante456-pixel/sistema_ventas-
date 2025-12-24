import { Request, Response } from 'express';
import prisma from '../config/prisma';
import ExcelJS from 'exceljs';

export const getSalesRegister = async (req: Request, res: Response) => {
    try {
        const sales = await prisma.venta.findMany({
            where: {
                estado: 'COMPLETADO' // Solo ventas completadas
            },
            include: {
                cliente: true,
                usuario: true
            },
            orderBy: {
                fechaVenta: 'desc'
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Registro de Ventas');

        // Columnas
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Tipo', key: 'tipo', width: 15 },
            { header: 'Serie/Nro', key: 'serie', width: 20 },
            { header: 'Cliente', key: 'cliente', width: 30 },
            { header: 'DNI/RUC', key: 'doc', width: 15 },
            { header: 'Base Imponible', key: 'base', width: 15 },
            { header: 'IGV (18%)', key: 'igv', width: 15 },
            { header: 'Total', key: 'total', width: 15 },
            { header: 'Vendedor', key: 'vendedor', width: 20 },
        ];

        // Estilos Header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEEEEE' }
        };

        // Datos
        sales.forEach((sale: any) => {
            const total = Number(sale.total);
            const base = total / 1.18;
            const igv = total - base;

            worksheet.addRow({
                id: sale.id,
                fecha: sale.fechaVenta.toISOString().split('T')[0],
                tipo: sale.tipoComprobante,
                serie: `${sale.serie || ''}-${sale.numero || ''}`,
                cliente: sale.cliente?.nombres || 'Público General',
                doc: sale.cliente?.dniRuc || '-',
                base: base,
                igv: igv,
                total: total,
                vendedor: sale.usuario?.usuario
            });
        });

        // Formato Moneda
        ['base', 'igv', 'total'].forEach(key => {
            const col = worksheet.getColumn(key);
            col.numFmt = '"S/" #,##0.00'; 
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=RegistroVentas.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generando reporte de ventas' });
    }
};

export const getInventoryValuation = async (req: Request, res: Response) => {
    try {
        const products = await prisma.producto.findMany({
            where: { estado: true },
            include: { categoria: true }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventario Valorizado');

        worksheet.columns = [
            { header: 'Código', key: 'codigo', width: 15 },
            { header: 'Producto', key: 'nombre', width: 40 },
            { header: 'Categoría', key: 'categoria', width: 20 },
            { header: 'Stock Actual', key: 'stock', width: 15 },
            { header: 'Costo Unit.', key: 'costo', width: 15 },
            { header: 'Precio Venta', key: 'precio', width: 15 },
            { header: 'Valor Total Costo', key: 'valorTotal', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };

        let totalInventoryValue = 0;

        products.forEach((p: any) => {
            const costo = Number(p.precioCompra);
            const totalValue = p.stock * costo;
            totalInventoryValue += totalValue;

            worksheet.addRow({
                codigo: p.codigo,
                nombre: p.nombre,
                categoria: p.categoria.nombre,
                stock: p.stock,
                costo: costo,
                precio: Number(p.precioVenta),
                valorTotal: totalValue
            });
        });

        ['costo', 'precio', 'valorTotal'].forEach(key => {
            worksheet.getColumn(key).numFmt = '"S/" #,##0.00';
        });

        // Fila Total
        worksheet.addRow({});
        const totalRow = worksheet.addRow({
            nombre: 'TOTAL INVENTARIO VALORIZADO',
            valorTotal: totalInventoryValue
        });
        totalRow.font = { bold: true };
        totalRow.getCell('valorTotal').numFmt = '"S/" #,##0.00';

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=InventarioValorizado.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generando reporte de inventario' });
    }
};

export const getBalanceSheet = async (req: Request, res: Response) => {
    try {
        const sales = await prisma.venta.findMany({
            where: { estado: 'COMPLETADO' }
        });

        const purchases = await prisma.compra.findMany();

        const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
        const totalPurchases = purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
        const balance = totalSales - totalPurchases;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Balance Comprobación');

        worksheet.columns = [
            { header: 'Concepto', key: 'concepto', width: 30 },
            { header: 'Debe (Egresos)', key: 'debe', width: 20 },
            { header: 'Haber (Ingresos)', key: 'haber', width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };

        worksheet.addRow({
            concepto: 'Ventas Totales',
            haber: totalSales
        });

        worksheet.addRow({
            concepto: 'Compras Totales',
            debe: totalPurchases
        });

        worksheet.addRow({});

        const resultRow = worksheet.addRow({
            concepto: 'RESULTADO DEL PERIODO',
            debe: balance < 0 ? Math.abs(balance) : 0,
            haber: balance > 0 ? balance : 0 
        });
        resultRow.font = { bold: true };

        ['debe', 'haber'].forEach(key => {
            worksheet.getColumn(key).numFmt = '"S/" #,##0.00';
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=BalanceComprobacion.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generando balance' });
    }
};
