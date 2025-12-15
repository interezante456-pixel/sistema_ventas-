import prisma from '../../config/prisma';

class CategoriesService {
    async getAll() {
        return await prisma.categoria.findMany({
            where: { estado: true },
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
}

export default new CategoriesService();
