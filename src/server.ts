import express from "express";

import { hotels } from "./data/hotels";
import { rooms } from "./data/rooms";
import { bookings } from "./data/bookings";

import { findBookingById } from "./helpers/bookingHelpers";

import hotelRoutes from "./routes/hotelRoutes";

const app = express();

app.use(express.json());

app.use(hotelRoutes);

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
}); 

