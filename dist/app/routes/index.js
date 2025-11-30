"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const division_route_1 = require("../modules/division/division.route");
const tour_route_1 = require("../modules/tour/tour.route");
const booking_routes_1 = require("../modules/booking/booking.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const stats_routes_1 = require("../modules/stats/stats.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/division",
        route: division_route_1.DivisionRoutes,
    },
    {
        path: "/tour",
        route: tour_route_1.TourRoutes,
    },
    {
        path: "/booking",
        route: booking_routes_1.BookingRoutes,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OTPRoutes,
    },
    {
        path: "/stats",
        route: stats_routes_1.StatsRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
//# sourceMappingURL=index.js.map