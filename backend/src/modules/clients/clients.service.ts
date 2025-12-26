import prisma from '../../config/prisma';

class ClientsService {
    
    // Obtener todos los clientes (activos e inactivos)
    async getAll() {
        return await prisma.cliente.findMany({
            orderBy: { id: 'desc' } // Los más nuevos primero
        });
    }

    // Obtener por ID
    async getById(id: number) {
        return await prisma.cliente.findUnique({
            where: { id }
        });
    }

    // Buscar por DNI o RUC (Útil para validaciones)
    async getByDniRuc(dniRuc: string) {
        return await prisma.cliente.findFirst({
            where: { dniRuc, estado: true }
        });
    }

    // Crear Cliente
    async create(data: any) {
        return await prisma.cliente.create({
            data: {
                nombres: data.nombres,
                dniRuc: data.dniRuc,
                telefono: data.telefono,
                direccion: data.direccion,
                email: data.email,
                estado: true
            }
        });
    }

    // Actualizar Cliente
    async update(id: number, data: any) {
        return await prisma.cliente.update({
            where: { id },
            data
        });
    }

    // Eliminar Cliente (Borrado físico)
    async delete(id: number) {
        return await prisma.cliente.delete({
            where: { id }
        });
    }
}

export default new ClientsService();