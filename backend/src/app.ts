import path from 'path';
import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import hotelRouter from '@/routes/hotel';
import roomRouter from '@/routes/room';
import bookingRouter from '@/routes/booking';
import reviewRouter from '@/routes/review';
import amenityRouter from '@/routes/amenity';
import globalErrorHanlder from '@/controllers/error';
import { protect } from './middlewares/auth';

const app: Express = express();

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

if (process.env.NODE_ENV === 'production')
  app.use((req, res) => {
    res.status(503).json({ message: 'Coming soon' });
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', protect, userRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/rooms', roomRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/amenities', amenityRouter);

app.use(globalErrorHanlder);

export default app;
