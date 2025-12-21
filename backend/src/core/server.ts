// Archivo: src/core/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { logger } from './logger';
import routes from '../routes';
import { errorHandler } from '../middlewares/errorHandler';

import path from 'path';

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

        // 👇 ESTA ES LA LÍNEA NUEVA PARA QUE SE VEAN LAS FOTOS 👇
        // Le dice a Express: "Si te piden algo que empiece con /uploads, búscalo en la carpeta uploads de mi PC"
        this.app.use('/uploads', express.static(path.resolve('uploads')));
    }

    private routes() {
        this.app.use('/api', routes);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log('\n');
            logger.info(`🚀 Servidor corriendo exitosamente en el puerto ${this.port}`);
            logger.info(`🔗 URL Base: http://localhost:${this.port}/api`);
            // Mensaje extra para saber que las imágenes funcionan
            logger.info(`📂 Carpeta pública: http://localhost:${this.port}/uploads`);
            console.log('\n');
        });
    }
}