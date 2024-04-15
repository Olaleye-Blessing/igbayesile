import mongoose from 'mongoose';

const DB = process.env.DB_URL!.replace('<PASSWORD>', process.env.DB_PASSWORD!);
const NODE_ENV = process.env.NODE_ENV;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB);

    if (NODE_ENV === 'production') return;

    console.log(' ✅ MONGO DB connection successful ');
  } catch (error) {
    if (process.env.NODE_ENV === 'production') return;

    console.log(' ❌ DB error');
    console.log(error);
  }
};
