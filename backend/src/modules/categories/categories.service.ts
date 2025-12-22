import prisma from '../../config/prisma';

class CategoriesService {
    async getAll() {
        return await prisma.categoria.findMany({
            where: { estado: true },
            include: {
                _count: {
                    select: { productos: true }
                }
            }
        });
    }

    async create(data: any) {
        return await prisma.categoria.create({ data });
    }

    async update(id: number, data: any) {
        return await prisma.categoria.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return await prisma.categoria.update({
            where: { id },
            data: { estado: false },
        });
    }
    async getById(id: number) {
    return await prisma.categoria.findUnique({
        where: { id },
        include: {
                _count: {
                    select: { productos: true }
                }
            }
    });
}
}

export default new CategoriesService();
