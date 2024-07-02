import { logger, secrets } from '@/core';
import Redis from 'ioredis';
import mongoose from 'mongoose';
const redis = new Redis(secrets.REDIS_URL);

redis.on('error', (err: unknown) => {
    logger.error('redis error');
});

redis.on('connect', () => {
    logger.info('redis connected');
});

redis.on('reconnecting', () => {
    logger.info('redis reconnecting');
});

async function connectDB() {
    await mongoose.connect(secrets.DATABASE_URL);
}

export { redis };
