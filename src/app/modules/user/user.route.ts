import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, UpdateUserZodSchema } from "./user.validation";
import { validationRequest } from "../../middlewares/validateReques";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();
router.post(
  "/register",
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);
router.patch(
  "/:id",
  validationRequest(UpdateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.get("/:id", UserControllers.getSingleUser);

export const UserRoutes = router;
