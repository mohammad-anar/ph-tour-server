"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuths_1 = require("../../middlewares/checkAuths");
const user_interfaces_1 = require("../user/user.interfaces");
const stats_controller_1 = require("./stats.controller");
const router = express_1.default.Router();
router.get("/users", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getUserStats);
router.get("/tours", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getTourStats);
router.get("/bookings", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getBookingStats);
router.get("/payments", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getPaymentStats);
exports.StatsRoutes = router;
//# sourceMappingURL=stats.routes.js.map