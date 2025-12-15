"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const categories_routes_1 = __importDefault(require("../modules/categories/categories.routes"));
const products_routes_1 = __importDefault(require("../modules/products/products.routes"));
const sales_routes_1 = __importDefault(require("../modules/sales/sales.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
router.use('/categories', categories_routes_1.default);
router.use('/products', products_routes_1.default);
router.use('/sales', sales_routes_1.default);
exports.default = router;
