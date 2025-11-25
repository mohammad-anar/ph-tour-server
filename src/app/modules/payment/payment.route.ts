import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// api/v1/booking
router.post("/success", PaymentController.successPayment);
router.post("/failed", PaymentController.failedPayment);
router.post("/canceled", PaymentController.canceledPayment);
router.post("/make-payment/:bookingId", PaymentController.makePayment);

export const PaymentRoutes = router;
