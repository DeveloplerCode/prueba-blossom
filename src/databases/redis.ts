// src/config/redis.ts

import { createClient, RedisClientType } from 'redis';


import { config } from '../config/config';


const redisClient: RedisClientType = createClient({
    url: config.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('Redis conectado exitosamente.');
    }
    return redisClient;
}

export default redisClient;