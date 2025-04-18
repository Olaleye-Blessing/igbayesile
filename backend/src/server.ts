import { v2 as cloudinary } from 'cloudinary';
import app from './app';
import { connectDBs } from './databases/init';
import { envData } from './configs/env-data';

const port = envData.PORT || 5000;

connectDBs();

cloudinary.config({
  cloud_name: envData.CLOUDINARY_CLOUD_NAME!,
  api_key: envData.CLOUDINARY_API_KEY!,
  api_secret: envData.CLOUDINARY_API_SECRET!,
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running on port: ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('____ 🔥 Unhandled rejection ____');
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
