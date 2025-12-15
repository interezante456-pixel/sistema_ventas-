"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = __importDefault(require("./categories.controller"));
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.verifyToken);
router.get('/', categories_controller_1.default.getAll);
router.post('/', categories_controller_1.default.create);
router.put('/:id', categories_controller_1.default.update);
router.delete('/:id', categories_controller_1.default.delete);
exports.default = router;
