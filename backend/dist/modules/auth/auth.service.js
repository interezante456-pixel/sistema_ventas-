"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    async register(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.default.usuario.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user;
    }
    async login(data) {
        const user = await prisma_1.default.usuario.findUnique({
            where: { usuario: data.usuario },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const validPassword = await bcryptjs_1.default.compare(data.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid password');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        return { user, token };
    }
}
exports.default = new AuthService();
