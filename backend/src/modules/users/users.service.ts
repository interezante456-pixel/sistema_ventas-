import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

class UsersService {
    async getAll() {
        //console.log("📢 Buscando usuarios en la BD...");
        
        const usuarios = await prisma.usuario.findMany({
            orderBy: { id: 'asc' }
        });

        //console.log(`✅ Encontrados: ${usuarios.length} usuarios`);
        //console.log(usuarios); // Muestra la lista en la consola negra
        
        return usuarios;
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
        return await prisma.usuario.delete({
            where: { id },
        });
    }
}

export default new UsersService();
