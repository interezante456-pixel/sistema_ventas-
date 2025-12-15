"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../config/prisma"));
class CategoriesService {
    async getAll() {
        return await prisma_1.default.categoria.findMany({
            where: { estado: true },
        });
    }
    async create(data) {
        return await prisma_1.default.categoria.create({ data });
    }
    async update(id, data) {
        return await prisma_1.default.categoria.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return await prisma_1.default.categoria.update({
            where: { id },
            data: { estado: false },
        });
    }
}
exports.default = new CategoriesService();
