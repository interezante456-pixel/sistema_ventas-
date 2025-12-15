"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UsersService {
    async getAll() {
        return await prisma_1.default.usuario.findMany({
            where: { estado: true },
        });
    }
    async getById(id) {
        return await prisma_1.default.usuario.findUnique({
            where: { id },
        });
    }
    async create(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        return await prisma_1.default.usuario.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
    async update(id, data) {
        if (data.password) {
            data.password = await bcryptjs_1.default.hash(data.password, 10);
        }
        return await prisma_1.default.usuario.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return await prisma_1.default.usuario.update({
            where: { id },
            data: { estado: false },
        });
    }
}
exports.default = new UsersService();
