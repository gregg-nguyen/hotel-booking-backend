import express from "express";
import { hotels } from "../data/hotels";
import { rooms } from "../data/rooms";

const router = express.Router();


router.get("/", (req, res) => {
  res.send("Hotel Booking Backend Running!");
});

router.get("/hotels", (req, res) => {
  res.json(hotels);
});

router.get("/rooms", (req, res) => {
  res.json(rooms);
});

router.get("/hotels/city/:city", (req, res) => {
  const city = req.params.city;

  const filteredHotels = hotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.toLowerCase()
  );

  res.json(filteredHotels);
});

router.get("/hotels/:id", (req, res) => {
  const hotelId = Number(req.params.id);

  const hotel = hotels.find((hotel) => hotel.id === hotelId);

  if (!hotel) {
    return res.status(404).json({
      message: "Hotel not found"
    });
  }

  res.json(hotel);
});

router.get("/hotels/:id/rooms", (req, res) => {
  const hotelId = Number(req.params.id);

  const hotelRooms = rooms.filter((room) => room.hotelId === hotelId);

  res.json(hotelRooms);
});

export default router;
 