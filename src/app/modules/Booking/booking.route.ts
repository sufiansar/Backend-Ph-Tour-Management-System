import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { BookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  BookingController.createBooking
);

export const BookingRouter = router;
