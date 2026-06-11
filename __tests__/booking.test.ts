import request from "supertest";
import { app } from "../src/app";
import pool from "../src/database/db";

const createdBookingIds: number[] = [];

describe("GET /bookings/:id", () => {
  it("returns 404 when booking does not exist", async () => {
    const response = await request(app).get("/bookings/999");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Booking not found"
    });
  });
});

describe("POST /bookings", () => {
  it("returns 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        hotelId: 1,
        roomId: 1
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "Missing required fields"
    });
  });

  it("returns 404 when hotel does not exist", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        hotelId: 999,
        roomId: 1,
        guestName: "Invalid Hotel Test",
        checkInDate: "2026-10-01",
        checkOutDate: "2026-10-03"
        });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
        success: false,
        message: "Hotel not found"
    });
    });
    
  it("returns 404 when room does not exist in the specified hotel", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        hotelId: 11,
        roomId: 999,
        guestName: "Invalid Room Test",
        checkInDate: "2026-10-10",
        checkOutDate: "2026-10-12"
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      message: "Room not found in the specified hotel"
    });
  });
  
  it("returns 400 when checkOutDate is before checkInDate", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        hotelId: 10,
        roomId: 1,
        guestName: "Invalid Date Test",
        checkInDate: "2026-10-10",
        checkOutDate: "2026-10-05"
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      message: "checkOutDate must be after checkInDate"
    });
  });

  it("returns 400 when booking dates overlap an existing booking", async () => {
  const response = await request(app)
    .post("/bookings")
    .send({
      hotelId: 10,
      roomId: 1,
      guestName: "Overlap Test",
      checkInDate: "2026-06-15",
      checkOutDate: "2026-06-22",
    });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    success: false,
    message: "Room is already booked for the selected dates",
    });
  });

  it("creates a booking when request data is valid", async () => {
  const response = await request(app)
    .post("/bookings")
    .send({
      hotelId: 11,
      roomId: 4,
      guestName: "Success Test",
      checkInDate: "2026-12-12",
      checkOutDate: "2026-12-15",
    });

  expect(response.status).toBe(201);

  createdBookingIds.push(response.body.booking.id);

  expect(response.body.message).toBe(
    "Booking created successfully"
  );

  expect(response.body.booking).toMatchObject({
    hotel_id: 11,
    room_id: 4,
    guest_name: "Success Test",
    nights: 3,
    total_price: 510,
  });
  });
});

afterEach(async () => {
  for (const bookingId of createdBookingIds) {
    await pool.query(
      "DELETE FROM bookings WHERE id = $1",
      [bookingId]
    );
  }

  createdBookingIds.length = 0;
});

afterAll(async () => {
  await pool.end();
});

