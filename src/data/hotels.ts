export interface Hotel {
  id: number;
  name: string;
  city: string;
  price: number;
}

export const hotels: Hotel[] = [
  {
    id: 1,
    name: "Tokyo Grand Hotel",
    city: "Tokyo",
    price: 120
  },
  {
    id: 2,
    name: "Osaka Sunset Hotel",
    city: "Osaka",
    price: 90
  }
];