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






router.post("/bookings", async (req, res) => {
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

  const result = await pool.query(
    `
    INSERT INTO bookings (
      hotel_id,
      room_id,
      guest_name,
      check_in_date,
      check_out_date,
      nights,
      total_price
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [
      finalBooking.hotelId,
      finalBooking.roomId,
      finalBooking.guestName,
      finalBooking.checkInDate,
      finalBooking.checkOutDate,
      finalBooking.nights,
      finalBooking.totalPrice
    ]
  );

  res.status(201).json({
    message: "Booking created successfully",
    booking: result.rows[0]
  });
});





router.delete("/bookings/:id", async (req, res) => {
  const bookingId = Number(req.params.id);

  const result = await pool.query(
    `
    DELETE FROM bookings
    WHERE id = $1
    RETURNING *
    `,
    [bookingId]
  );

  const deletedBooking = result.rows[0];

  if (!deletedBooking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  res.json({
    message: "Booking deleted successfully",
    booking: deletedBooking
  });
});





router.patch("/bookings/:id", async (req, res) => {
  const bookingId = Number(req.params.id);

  const {
    guestName,
    checkInDate,
    checkOutDate,
  } = req.body;

  const existingBookingResult = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );

  const existingBooking = existingBookingResult.rows[0];

  if (!existingBooking) {
    return res.status(404).json({
      message: "Booking not found"
    });
  }

  const finalGuestName = guestName ?? existingBooking.guest_name;
  const finalCheckInDate = checkInDate ?? existingBooking.check_in_date;
  const finalCheckOutDate = checkOutDate ?? existingBooking.check_out_date;

  const finalRoomId = existingBooking.room_id;

  const foundRoom = rooms.find(
    (room) => room.id === Number(finalRoomId)
  );

  if (!foundRoom) {
    return res.status(400).json({
      message: "Room not found"
    });
  }

  const checkIn = new Date(finalCheckInDate);
  const checkOut = new Date(finalCheckOutDate);

  const nights =
    (checkOut.getTime() - checkIn.getTime()) / MILLISECONDS_PER_DAY;

  if (nights <= 0) {
    return res.status(400).json({
      message: "checkOutDate must be after checkInDate"
    });
  }

  const totalPrice = foundRoom.price * nights;

  const result = await pool.query(
    `
    UPDATE bookings
    SET
      guest_name = $1,
      check_in_date = $2,
      check_out_date = $3,
      nights = $4,
      total_price = $5
    WHERE id = $6
    RETURNING *
    `,
    [
      finalGuestName,
      finalCheckInDate,
      finalCheckOutDate,
      nights,
      totalPrice,
      bookingId,
    ]
  );

  res.json({
    message: "Booking updated successfully",
    booking: result.rows[0]
  });
});

export default router;

