import express from "express";

import hotelRoutes from "./routes/hotelRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(hotelRoutes);
app.use(bookingRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
}); 

