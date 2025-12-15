// Archivo: src/core/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { logger } from './logger';
import routes from '../routes';
import { errorHandler } from '../middlewares/errorHandler';

export class Server {
    private app: Application;
    private port: number | string;

    constructor() {
        this.app = express();
        this.port = env.PORT;

        this.connect();
        this.middlewares();
        this.routes();
        // El manejador de errores debe ir al final
        this.app.use(errorHandler);
    }

    private async connect() {
        await connectDB();
    }

    private middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private routes() {
        this.app.use('/api', routes);
    }

    public listen() {
        this.app.listen(this.port, () => {
            // 👇 AQUÍ ESTÁ EL MENSAJE QUE QUIERES VER 👇
            console.log('\n'); // Un salto de línea para que se vea ordenado
            logger.info(`🚀 Servidor corriendo exitosamente en el puerto ${this.port}`);
            logger.info(`🔗 URL Base: http://localhost:${this.port}/api`);
            console.log('\n');
        });
    }
}