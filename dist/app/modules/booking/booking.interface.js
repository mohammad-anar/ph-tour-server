"use strict";
// User - Booking(pending) -> Payment (unpain) -> SSLCommerz -> Booking Update = confirm -> Payment update = Paid
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKING_STATUS = void 0;
var BOOKING_STATUS;
(function (BOOKING_STATUS) {
    BOOKING_STATUS["PENDING"] = "PENDING";
    BOOKING_STATUS["CANCELED"] = "CANCELED";
    BOOKING_STATUS["COMPLETED"] = "COMPLETED";
    BOOKING_STATUS["FAILED"] = "FAILED";
})(BOOKING_STATUS || (exports.BOOKING_STATUS = BOOKING_STATUS = {}));
//# sourceMappingURL=booking.interface.js.map