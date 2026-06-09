import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function validateCreateBooking(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newBooking = req.body;

  if (
    !newBooking.hotelId ||
    !newBooking.roomId ||
    !newBooking.guestName ||
    !newBooking.checkInDate ||
    !newBooking.checkOutDate
  ) {
    return next(
      new AppError("Missing required fields", 400)
    );
  }

  next();
}