import { Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsycn(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const booking = await BookingService.createBooking(
    req.body,
    decodedToken.userId
  );

  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Booking Create Successfully",
    data: booking,
  });
});

export const BookingController = {
  createBooking,
};
