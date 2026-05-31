export interface Booking {
  id: number;
  hotelId: number;
  roomId: number;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
}

export const bookings: Booking[] = [];