import express from "express";
import pool from "../database/db";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const router = express.Router();

interface NewBookingRequest {
  hotelId: number;
  roomId: number;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
}

interface UpdateBookingRequest {
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

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
  const newBooking = req.body as NewBookingRequest;

  if (
    !newBooking.hotelId ||
    !newBooking.roomId ||
    !newBooking.guestName ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const hotelCheck = await pool.query(
    "SELECT * FROM hotels WHERE id = $1",
    [newBooking.hotelId]
  );

  if (hotelCheck.rowCount === 0) {
    return res.status(400).json({
      message: "Hotel not found"
    });
  }

  const foundRoom = await pool.query(
    "SELECT * FROM rooms WHERE id = $1 AND hotel_id = $2",
    [newBooking.roomId, newBooking.hotelId]
  );

  if (foundRoom.rowCount === 0) {
    return res.status(400).json({
      message: "Room not found in the specified hotel"
    });
  }

  const room = foundRoom.rows[0];

  const price = room.price;

  const checkInDate = new Date(newBooking.checkInDate);
  const checkOutDate = new Date(newBooking.checkOutDate);

  const nights = Math.ceil(
  (checkOutDate.getTime() - checkInDate.getTime()) / MILLISECONDS_PER_DAY
  );

  if (nights <= 0) {
    return res.status(400).json({
    message: "checkOutDate must be after checkInDate"
    });
  }
  
  const overlappingBookingResult = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE room_id = $1
      AND check_in_date < $2
      AND check_out_date > $3
    `,
    [
      Number(newBooking.roomId),
      newBooking.checkOutDate,
      newBooking.checkInDate
    ]
  );

  const overlappingBooking = overlappingBookingResult.rows[0];

  if (overlappingBooking) {
    return res.status(400).json({
      message: "Room is already booked for the selected dates"
    });
  }

  const finalBooking = {
    hotelId: Number(newBooking.hotelId),
    roomId: Number(newBooking.roomId),
    guestName: newBooking.guestName,
    checkInDate: newBooking.checkInDate,
    checkOutDate: newBooking.checkOutDate,
    nights: nights,
    totalPrice: price * nights
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
  } = req.body as UpdateBookingRequest;

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

  const roomCheck = await pool.query(
    "SELECT * FROM rooms WHERE id = $1",
    [finalRoomId]
  );

    if (roomCheck.rowCount === 0) {
    return res.status(400).json({
      message: "Room not found"
    });
  }

  const room = roomCheck.rows[0];

  const checkIn = new Date(finalCheckInDate);
  const checkOut = new Date(finalCheckOutDate);

  const nights = Math.ceil(
  (checkOut.getTime() - checkIn.getTime()) / MILLISECONDS_PER_DAY
);

  if (nights <= 0) {
    return res.status(400).json({
      message: "checkOutDate must be after checkInDate"
    });
  }

  const overlappingBookingResult = await pool.query(
    `
    SELECT *
    FROM bookings
    WHERE room_id = $1
      AND id != $2
      AND check_in_date < $3
      AND check_out_date > $4
    `,
    [
      Number(finalRoomId),
      bookingId,
      finalCheckOutDate,
      finalCheckInDate
    ]
  );

  const overlappingBooking = overlappingBookingResult.rows[0];

  if (overlappingBooking) {
    return res.status(400).json({
      message: "Room is already booked for the selected dates"
    });
  }

  const totalPrice = room.price * nights;

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

