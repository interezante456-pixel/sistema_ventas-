import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.usuario.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user;
    }

    async login(data: any) {
        const { usuario, password } = data;

        // 1. Buscar al usuario
        const userFound = await prisma.usuario.findFirst({
            where: { usuario }
        });

        // 2. Si no existe
        if (!userFound) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // 3. VALIDACIÓN DE ESTADO (Lo que agregamos hoy)
        if (userFound.estado === false) {
            throw new Error('⛔ Acceso denegado: Tu cuenta está inhabilitada. Contacta al administrador.');
        }

        // 4. Verificar contraseña (ahora sí funcionará bcrypt)
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
            throw new Error('Usuario o contraseña incorrectos');
        }

        // 5. Generar Token (ahora sí funcionará jwt)
        const token = jwt.sign(
            { id: userFound.id, rol: userFound.rol },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '1d' }
        );

        // 6. Retornar datos sin password
        const { password: _, ...userWithoutPassword } = userFound;

        return {
            token,
            user: userWithoutPassword
        };
    }
}

export default new AuthService();
