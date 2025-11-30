import express from "express";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interfaces";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getUserStats
);
router.get(
  "/tours",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getTourStats
);
router.get(
  "/bookings",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getBookingStats
);
router.get(
  "/payments",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getPaymentStats
);

export const StatsRoutes = router;
