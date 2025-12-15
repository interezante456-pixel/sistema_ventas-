"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = __importDefault(require("./sales.controller"));
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.verifyToken);
router.get('/', sales_controller_1.default.getAll);
router.get('/:id', sales_controller_1.default.getById);
router.post('/', sales_controller_1.default.create);
exports.default = router;
