export interface Booking {
  id: number;
  hotelId: number;
  roomId: number;
  guestName: string;
  nights: number;
  totalPrice: number;
}

export const bookings: Booking[] = [];