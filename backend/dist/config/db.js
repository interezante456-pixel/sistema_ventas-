"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const logger_1 = require("../core/logger");
const connectDB = async () => {
    try {
        await prisma_1.default.$connect();
        logger_1.logger.info('Database connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Database connection failed', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
