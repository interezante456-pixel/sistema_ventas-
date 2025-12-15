import prisma from './prisma';
import { logger } from '../core/logger';

export const connectDB = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed', error);
        process.exit(1);
    }
};
