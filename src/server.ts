import express from "express";

import { hotels } from "./data/hotels";
import { rooms } from "./data/rooms";
import { bookings } from "./data/bookings";

import { findBookingById } from "./helpers/bookingHelpers";

import hotelRoutes from "./routes/hotelRoutes";
import bookingRoutes from "./routes/bookingRoutes";

const app = express();

app.use(express.json());

app.use(hotelRoutes);

app.use(bookingRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
}); 

