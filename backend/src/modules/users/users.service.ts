import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

class UsersService {
    async getAll() {
        return await prisma.usuario.findMany({
            where: { estado: true },
        });
    }

    async getById(id: number) {
        return await prisma.usuario.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await prisma.usuario.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async update(id: number, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return await prisma.usuario.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return await prisma.usuario.update({
            where: { id },
            data: { estado: false },
        });
    }
}

export default new UsersService();
