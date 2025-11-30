"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const checkAuths_1 = require("../../middlewares/checkAuths");
const user_interfaces_1 = require("../user/user.interfaces");
const router = express_1.default.Router();
// api/v1/booking
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.post("/failed", payment_controller_1.PaymentController.failedPayment);
router.post("/canceled", payment_controller_1.PaymentController.canceledPayment);
router.post("/make-payment/:bookingId", payment_controller_1.PaymentController.makePayment);
router.get("/invoice/:paymentId", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), payment_controller_1.PaymentController.getInvoiceUrl);
router.post("/validate-payment", payment_controller_1.PaymentController.validatePayment);
exports.PaymentRoutes = router;
//# sourceMappingURL=payment.route.js.map