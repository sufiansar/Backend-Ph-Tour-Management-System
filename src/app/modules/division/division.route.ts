import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validationRequest } from "../../middlewares/validateReques";
import {
  createDivisionZodSchema,
  UpdateDivisionZodeSchema,
} from "./division.zodValidation";
import { divisionController } from "./division.controller";
import { Role } from "../user/user.interface";
import { MulterUpload } from "../../config/multer";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MulterUpload.single("file"),
  validationRequest(createDivisionZodSchema),
  divisionController.createDivision
);
router.get("/", divisionController.getAllDivisions);
router.get("/:slug", divisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MulterUpload.single("file"),
  validationRequest(UpdateDivisionZodeSchema),
  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision
);

export const DivisionRoutes = router;
