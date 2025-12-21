import prisma from '../../config/prisma';

class ProductsService {
    async getAll() {
        return await prisma.producto.findMany({
            include: { categoria: true },
            orderBy: { id: 'desc' }
        });
    }

    async getById(id: number) {
        return await prisma.producto.findUnique({
            where: { id },
            include: { categoria: true },
        });
    }

    async create(data: any) {
        return await prisma.producto.create({ data });
    }

    async update(id: number, data: any) {
        return await prisma.producto.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return await prisma.producto.update({
            where: { id },
            data: { estado: false },
        });
    }
}

export default new ProductsService();
