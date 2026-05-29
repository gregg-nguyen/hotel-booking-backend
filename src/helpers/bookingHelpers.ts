import { bookings } from "../data/bookings";

export function findBookingById(id: number) {
  return bookings.find((booking) => booking.id === id);
}