"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
class ProductsService {
    async getAll() {
        return await prisma_1.default.producto.findMany({
            where: { estado: true },
            include: { categoria: true },
        });
    }
    async getById(id) {
        return await prisma_1.default.producto.findUnique({
            where: { id },
            include: { categoria: true },
        });
    }
    async create(data) {
        return await prisma_1.default.producto.create({ data });
    }
    async update(id, data) {
        return await prisma_1.default.producto.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return await prisma_1.default.producto.update({
            where: { id },
            data: { estado: false },
        });
    }
}
exports.default = new ProductsService();
