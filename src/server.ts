import express from "express";

const app = express();

app.use(express.json());

const hotels = [
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

app.get("/", (req, res) => {
  res.send("Hotel Booking Backend Running!");
});

app.get("/hotels", (req, res) => {
  res.json(hotels);
});

app.get("/hotels/:id", (req, res) => {
  const hotelId = Number(req.params.id);

  const hotel = hotels.find((hotel) => hotel.id === hotelId);

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  res.json(hotel);
});

const rooms = [ 
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

const bookings: any[] = [];

app.get("/hotels/:id/rooms", (req, res) => {
  const hotelId = Number(req.params.id);

  const hotelRooms = rooms.filter((room) => room.hotelId === hotelId);

  res.json(hotelRooms);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});   

app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/bookings", (req, res) => {
  const newBooking = req.body;

  if (!newBooking.hotelId || !newBooking.guestName || !newBooking.nights) {
  return res.status(400).json({
    message: "hotelId, guestName, and nights are required"
  });
}

  bookings.push(newBooking);

  res.status(201).json({
    message: "Booking created successfully",
    booking: newBooking
  });
});