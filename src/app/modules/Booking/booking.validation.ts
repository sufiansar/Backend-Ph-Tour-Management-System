import { z } from "zod";
import { BOOKING_STATUS } from "./booking.interface";
import mongoose from "mongoose";

export const createBookingZodSchema = z.object({
  body: z.object({
    user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid user ID",
    }),
    tour: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid tour ID",
    }),
    payment: z
      .string()
      .optional()
      .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid payment ID",
      }),
    guestCount: z.number().min(1, "Guest count must be at least 1"),
    status: z
      .enum([
        BOOKING_STATUS.PENDING,
        BOOKING_STATUS.COMPLETE,
        BOOKING_STATUS.CANCEL,
        BOOKING_STATUS.PENDING,
      ])
      .optional(),
  }),
});
