import express from "express";
import { bookings } from "../data/bookings";
import { hotels } from "../data/hotels";
import { rooms } from "../data/rooms";
import { findBookingById } from "../helpers/bookingHelpers";
import pool from "../database/db";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const router = express.Router();

router.get("/bookings", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM bookings"
  );

  res.json(result.rows);
});

router.get("/bookings/:id", async (req, res) => {
  const bookingId = Number(req.params.id);

  const result = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  const booking = result.rows[0];

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

  if (
    !newBooking.hotelId ||
    !newBooking.roomId ||
    !newBooking.guestName ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
    ) {

    return res.status(400).json({
      message: "hotelId, roomId, guestName, checkInDate, and checkOutDate are required"
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

  const checkInDate = new Date(newBooking.checkInDate);
  const checkOutDate = new Date(newBooking.checkOutDate);

  const nights =
    (checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY;

  if (nights <= 0) {
    return res.status(400).json({
    message: "checkOutDate must be after checkInDate"
    });
  }
  
  const overlappingBooking = bookings.find((booking) => {
    const existingCheckInDate = new Date(booking.checkInDate);
    const existingCheckOutDate = new Date(booking.checkOutDate);

    return (
      booking.roomId === Number(newBooking.roomId) &&
      checkInDate < existingCheckOutDate &&
      checkOutDate > existingCheckInDate
    );
  });

  if (overlappingBooking) {
    return res.status(400).json({
      message: "Room is already booked for the selected dates"
    });
  }

  const finalBooking = {
    id: bookings.length + 1,
    hotelId: Number(newBooking.hotelId),
    roomId: Number(newBooking.roomId),
    guestName: newBooking.guestName,
    checkInDate: newBooking.checkInDate,
    checkOutDate: newBooking.checkOutDate,
    nights: nights,
    totalPrice: foundRoom.price * nights
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
