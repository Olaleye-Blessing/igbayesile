import { IBooking } from '@/interfaces/booking';
import mongoose, { model, Schema } from 'mongoose';

const bookingSchema = new Schema<IBooking>(
  {
    status: {
      type: String,
      required: [true, 'Booking status: Internal server error'],
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: 'Booking status: Internal server error',
      },
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Provide the user of this booking.'],
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      required: [true, 'Provide the room being booked.'],
    },
    paymentReference: {
      type: String,
      required: [true, 'Payment Reference: Internal server error'],
    },
    paymentAccessCode: {
      type: String,
    },
    paymentId: {
      type: Number,
    },
    guests: {
      type: Number,
      required: [true, 'Provide the number of guests.'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Provide the check in date'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Provide the check out date'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Provide total cost'],
    },
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Booking = model('Booking', bookingSchema);

export default Booking;
