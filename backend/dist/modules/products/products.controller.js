"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_service_1 = __importDefault(require("./products.service"));
class ProductsController {
    async getAll(req, res) {
        try {
            const products = await products_service_1.default.getAll();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const product = await products_service_1.default.getById(Number(req.params.id));
            if (!product)
                return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            const product = await products_service_1.default.create(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const product = await products_service_1.default.update(Number(req.params.id), req.body);
            res.json(product);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await products_service_1.default.delete(Number(req.params.id));
            res.json({ message: 'Product deleted' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.default = new ProductsController();
