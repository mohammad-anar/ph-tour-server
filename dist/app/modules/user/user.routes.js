"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_controller_1 = require("./user.controller");
const user_interfaces_1 = require("./user.interfaces");
const user_validation_1 = require("./user.validation");
const checkAuths_1 = require("../../middlewares/checkAuths");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get("/get-me", (0, checkAuths_1.checkAuth)(...Object.values(user_interfaces_1.Role)), user_controller_1.UserControllers.getMe);
// update user
router.patch("/:id", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.updateUser);
exports.UserRoutes = router;
//# sourceMappingURL=user.routes.js.map