import { envData } from '@/configs/env-data';
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

const connectRedisDB = async () => {
  redisClient = createClient({ url: envData.REDIS_URL });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  await redisClient.connect();

  console.log('✅ REDIS DB connection successful');
};

export { connectRedisDB, redisClient };
