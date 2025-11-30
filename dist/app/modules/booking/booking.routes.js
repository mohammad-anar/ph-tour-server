"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuths_1 = require("../../middlewares/checkAuths");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interfaces_1 = require("../user/user.interfaces");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = express_1.default.Router();
// api/v1/booking
router.post("/create", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), (0, validateRequest_1.validateRequest)(booking_validation_1.createBookingZodSchema), booking_controller_1.BookingController.createBooking);
router.get("/", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), booking_controller_1.BookingController.getAllBookings);
router.get("/my-bookings", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), booking_controller_1.BookingController.getUserBookings);
router.get("/:bookingId", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), booking_controller_1.BookingController.getSingleBooking);
router.patch("/:bookingId/status", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), (0, validateRequest_1.validateRequest)(booking_validation_1.updateBookingZodSchema), booking_controller_1.BookingController.updateBooking);
exports.BookingRoutes = router;
//# sourceMappingURL=booking.routes.js.map