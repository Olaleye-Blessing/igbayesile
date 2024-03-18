import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRouter from '@/routes/auth';
import globalErrorHanlder from '@/controllers/error';

const app: Express = express();

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/auth', authRouter);

app.use(globalErrorHanlder);

export default app;
