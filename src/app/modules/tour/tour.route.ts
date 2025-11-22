import express from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interfaces";
import { tourController } from "./tour.controller";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";

const router = express.Router();

/* -------------tour type routes-------------------*/
// router.get("/tour-types", tourController.getAllTourTyes);
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.createTourType
);
// router.patch(
//   "/tour-types/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   validateRequest(createTourTypeZodSchema),
//   tourController.updateTourType
// );
// router.patch(
//   "/tour-types/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   tourController.deleteTourType
// );
/* -------------tour routes-------------------*/
router.get("/", tourController.getAllTours);
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  tourController.createTour
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourController.updateTour
);

// router.delete(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   tourController.deleteTour
// );

export const TourRoutes = router;
