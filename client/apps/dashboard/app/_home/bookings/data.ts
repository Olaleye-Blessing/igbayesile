export const bookings = {
  total: 700,
  scheduled: 400, // future bookings i.e from now till forever
  checked_in: 70, // currently occupied
  checked_out: 130,
};

export type IBookingData = typeof bookings;
export type IBookingKeys = keyof typeof bookings;
