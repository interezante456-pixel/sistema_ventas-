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
        // Error handler should be last
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
            logger.info(`Server running on port ${this.port}`);
        });
    }
}
