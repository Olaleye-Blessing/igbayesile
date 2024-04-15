import { connectMongoDB } from './mongo';
import { connectRedisDB } from './redis';

export const connectDBs = async () => {
  await connectRedisDB();
  await connectMongoDB();
};
