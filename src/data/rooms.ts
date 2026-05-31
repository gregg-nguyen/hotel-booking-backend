export interface Room {
  id: number;
  hotelId: number;
  name: string;
  capacity: number;
  price: number;
}

export const rooms: Room[] = [
  {
    id: 1,
    hotelId: 1,
    name: "Standard Room",
    capacity: 2,
    price: 120
  },
  {
    id: 2,
    hotelId: 1,
    name: "Deluxe Room",
    capacity: 3,
    price: 180
  },
  {
    id: 3,
    hotelId: 2,
    name: "Budget Room",
    capacity: 2,
    price: 90
  }
];