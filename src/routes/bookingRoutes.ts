import express from "express";
import { bookings } from "../data/bookings";
import { hotels } from "../data/hotels";
import { rooms } from "../data/rooms";
import { findBookingById } from "../helpers/bookingHelpers";

const router = express.Router();

router.get("/bookings", (req, res) => {
  res.json(bookings);
});

router.get("/bookings/:id", (req, res) => {
  const bookingId = Number(req.params.id);

  const booking = findBookingById(bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  res.json(booking);
});




router.post("/bookings", (req, res) => {
  const newBooking = {
  id: bookings.length + 1,
  ...req.body
};

  if (!newBooking.hotelId || !newBooking.roomId || !newBooking.guestName || !newBooking.nights) {
  return res.status(400).json({
    message: "hotelId, roomId, guestName, and nights are required"
  });
}

  const foundHotel = hotels.find(
    (hotel) => hotel.id === Number(newBooking.hotelId)
  );

  if (!foundHotel) {
    return res.status(400).json({
      message: "Hotel not found"
    });
  }

  if (Number(newBooking.nights) <= 0) {
    return res.status(400).json({
      message: "nights must be a positive number"
    });
  }

  const foundRoom = rooms.find(
    (room) =>
      room.id === Number(newBooking.roomId) &&
      room.hotelId === Number(newBooking.hotelId)
  );

  if (!foundRoom) {
    return res.status(400).json({
      message: "Room not found for this hotel"
    });
  }
  
  const finalBooking = {
    id: bookings.length + 1,
    hotelId: Number(newBooking.hotelId),
    roomId: Number(newBooking.roomId),
    guestName: newBooking.guestName,
    nights: Number(newBooking.nights),
    totalPrice: foundRoom.price * Number(newBooking.nights)
  };

  bookings.push(finalBooking);

  res.status(201).json({
    message: "Booking created successfully",
    booking: finalBooking
  });
});




router.delete("/bookings/:id", (req, res) => {
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

router.patch("/bookings/:id", (req, res) => {
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

export default router;
