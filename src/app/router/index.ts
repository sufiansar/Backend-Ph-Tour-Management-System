import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";
import { BookingRouter } from "../modules/Booking/booking.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { OtpRouter } from "../modules/otp/otp.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRouter,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
