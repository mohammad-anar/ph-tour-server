import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interfaces";
import { validateRequest } from "../../middlewares/validateRequest";
import { DivisionController } from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionController.createDivision
);

router.get("/", DivisionController.getAllDivisions);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const DivisionRoutes = router;
