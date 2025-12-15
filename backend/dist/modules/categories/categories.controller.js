"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_service_1 = __importDefault(require("./categories.service"));
class CategoriesController {
    async getAll(req, res) {
        const categories = await categories_service_1.default.getAll();
        res.json(categories);
    }
    async create(req, res) {
        const category = await categories_service_1.default.create(req.body);
        res.status(201).json(category);
    }
    async update(req, res) {
        const category = await categories_service_1.default.update(Number(req.params.id), req.body);
        res.json(category);
    }
    async delete(req, res) {
        await categories_service_1.default.delete(Number(req.params.id));
        res.json({ message: 'Category deleted' });
    }
}
exports.default = new CategoriesController();
