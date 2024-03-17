import express, { Express } from 'express';
import morgan from 'morgan';

import authRouter from './routes/auth';

const app: Express = express();

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/auth', authRouter);

export default app;
