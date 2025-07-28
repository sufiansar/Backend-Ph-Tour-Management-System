import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, UpdateUserZodSchema } from "./user.validation";
import { validationRequest } from "../../middlewares/validateReques";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { MulterUpload } from "../../config/multer";
import { object } from "zod";

const router = Router();

router.post(
  "/register",
  MulterUpload.single("file"),
  validationRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",

  validationRequest(UpdateUserZodSchema),
  MulterUpload.single("file"),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
