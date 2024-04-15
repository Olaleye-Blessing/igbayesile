// https://stackoverflow.com/a/72335470 set up path alias
import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { v2 as cloudinary } from 'cloudinary';
import app from './app';
import { connectDBs } from './databases/init';

const port = process.env.PORT || 5000;

connectDBs();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('____ 🔥 Unhandled rejection ____');
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
