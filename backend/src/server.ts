// https://stackoverflow.com/a/72335470 set up path alias
import 'module-alias/register';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import app from './app';
import { connectDB } from './db';

const port = process.env.PORT || 5000;

connectDB();

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
