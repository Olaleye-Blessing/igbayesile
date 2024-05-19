import { envData } from '@/configs/env-data';
import mongoose from 'mongoose';

const DB = envData.MONGO_DB_URL!;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB);

    console.log(' ✅ MONGO DB connection successful ');
  } catch (error) {
    if (envData.NODE_ENV === 'production') return;

    console.log(' ❌ DB error');
    console.log(error);
  }
};
