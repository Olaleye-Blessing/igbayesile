import path from 'path';
import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import globalErrorHanlder from '@/controllers/error';
import { protect } from './controllers/auth';

const app: Express = express();

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', protect, userRouter);


app.use(globalErrorHanlder);

export default app;
