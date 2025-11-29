import express from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuths";
import { Role } from "../user/user.interfaces";

const router = express.Router();

// api/v1/booking
router.post("/success", PaymentController.successPayment);
router.post("/failed", PaymentController.failedPayment);
router.post("/canceled", PaymentController.canceledPayment);
router.post("/make-payment/:bookingId", PaymentController.makePayment);
router.get(
  "/invoice/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentController.getInvoiceUrl
);

export const PaymentRoutes = router;
