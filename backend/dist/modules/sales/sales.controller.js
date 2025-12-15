"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sales_service_1 = __importDefault(require("./sales.service"));
class SalesController {
    async getAll(req, res) {
        try {
            const sales = await sales_service_1.default.getAll();
            res.json(sales);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const sale = await sales_service_1.default.getById(Number(req.params.id));
            if (!sale)
                return res.status(404).json({ error: 'Sale not found' });
            res.json(sale);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async create(req, res) {
        try {
            // Ensure usuarioId is attached from the token/session
            const data = { ...req.body, usuarioId: req.user.id };
            const sale = await sales_service_1.default.create(data);
            res.status(201).json(sale);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.default = new SalesController();
