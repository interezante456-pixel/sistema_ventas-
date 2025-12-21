// backend/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Encriptar la contraseña
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 2. Crear el usuario
  // Ajusta los campos si tu Schema requiere 'email' o 'nombre'
  const user = await prisma.usuario.create({
    data: {
      usuario: 'admin',          // Este será tu usuario para loguearte
      password: hashedPassword,  // Contraseña encriptada
      rol: 'ADMIN',              // Asumiendo que tienes un campo rol
      nombre: 'Administrador',   // Campo opcional común
      estado: true               // Para que esté activo
    },
  });

  console.log('✅ Usuario creado con éxito:');
  console.log(user);
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuario:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });