"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = __importDefault(require("./products.controller"));
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.verifyToken);
router.get('/', products_controller_1.default.getAll);
router.get('/:id', products_controller_1.default.getById);
router.post('/', products_controller_1.default.create);
router.put('/:id', products_controller_1.default.update);
router.delete('/:id', products_controller_1.default.delete);
exports.default = router;
