"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRoutes = void 0;
const express_1 = require("express");
const checkAuths_1 = require("../../middlewares/checkAuths");
const user_interfaces_1 = require("../user/user.interfaces");
const validateRequest_1 = require("../../middlewares/validateRequest");
const division_controller_1 = require("./division.controller");
const division_validation_1 = require("./division.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(division_validation_1.createDivisionZodSchema), division_controller_1.DivisionController.createDivision);
router.get("/", division_controller_1.DivisionController.getAllDivisions);
router.get("/:slug", division_controller_1.DivisionController.getSingleDivision);
router.patch("/:id", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(division_validation_1.updateDivisionZodSchema), division_controller_1.DivisionController.updateDivision);
router.delete("/:id", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), division_controller_1.DivisionController.deleteDivision);
exports.DivisionRoutes = router;
//# sourceMappingURL=division.route.js.map