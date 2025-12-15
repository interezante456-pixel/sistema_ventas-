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
        const user = await prisma.usuario.findUnique({
            where: { usuario: data.usuario },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        return { user, token };
    }
}

export default new AuthService();
