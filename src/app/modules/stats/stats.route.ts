import { Router } from "express";
import { StatsContoller } from "./stats.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsContoller.getUserStats
);

router.get(
  "/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsContoller.getTourStats
);

router.get(
  "/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsContoller.getBookingStats
);
router.get(
  "/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsContoller.getPaymentStats
);

export const StatsRouter = router;
