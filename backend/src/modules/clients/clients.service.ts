import prisma from '../../config/prisma';

class ClientsService {
    
    // Obtener todos los clientes (activos)
    async getAll() {
        return await prisma.cliente.findMany({
            where: { estado: true },
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

    // Eliminar Cliente (Borrado lógico)
    async delete(id: number) {
        return await prisma.cliente.update({
            where: { id },
            data: { estado: false }
        });
    }
}

export default new ClientsService();