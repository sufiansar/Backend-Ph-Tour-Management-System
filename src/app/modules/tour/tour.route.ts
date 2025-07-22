import { checkAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validateReques";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  UpdateTourZodSchema,
} from "./tour.ZodValidation";
import express from "express";

const router = express.Router();

router.get("/tour-types", TourController.getAllTourTypes);

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourController.createTourType
);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypeZodSchema),
  TourController.updateTourType
);

router.get(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.getSingleTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);

router.get("/", TourController.getAllTours);
router.get("/:id", TourController.getSingleTour);

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourZodSchema),
  TourController.createTour
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(UpdateTourZodSchema),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

export const TourRoutes = router;
