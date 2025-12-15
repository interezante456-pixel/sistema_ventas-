"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const routes_1 = __importDefault(require("../routes"));
const errorHandler_1 = require("../middlewares/errorHandler");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = env_1.env.PORT;
        this.connect();
        this.middlewares();
        this.routes();
        // Error handler should be last
        this.app.use(errorHandler_1.errorHandler);
    }
    async connect() {
        await (0, db_1.connectDB)();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use('/api', routes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            logger_1.logger.info(`Server running on port ${this.port}`);
        });
    }
}
exports.Server = Server;
