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

app.get("/hotels/city/:city", (req, res) => {
  const city = req.params.city;

  const filteredHotels = hotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
  );

  res.json(filteredHotels);
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

function findBookingById(id: number) {
  return bookings.find((booking) => booking.id === id);
}

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

app.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);

  const booking = findBookingById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  res.json(booking);
});

app.post("/bookings", (req, res) => {
  const newBooking = {
  id: bookings.length + 1,
  ...req.body
};

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

app.delete("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);

  const bookingIndex = bookings.findIndex(
    (booking) => booking.id === bookingId
  );

  if (bookingIndex === -1) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  bookings.splice(bookingIndex, 1);

  res.json({
    message: "Booking deleted successfully"
  });
});

app.patch("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);

  const booking = findBookingById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  Object.assign(booking, req.body);

  res.json({
    message: "Booking updated successfully",
    booking: booking
  });
});

