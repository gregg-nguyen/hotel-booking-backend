import express from "express";

const app = express();

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

  const hotel = hotels.find((h) => h.id === hotelId);

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

app.get("/hotels/:id/rooms", (req, res) => {
  const hotelId = Number(req.params.id);

  const hotelRooms = rooms.filter((room) => room.hotelId === hotelId);

  res.json(hotelRooms);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});