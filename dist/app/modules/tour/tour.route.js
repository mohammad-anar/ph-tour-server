"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuths_1 = require("../../middlewares/checkAuths");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interfaces_1 = require("../user/user.interfaces");
const tour_controller_1 = require("./tour.controller");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
/* -------------tour type routes-------------------*/
// router.get("/tour-types", tourController.getAllTourTyes);
router.post("/create-tour-type", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.tourController.createTourType);
// router.patch(
//   "/tour-types/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   validateRequest(createTourTypeZodSchema),
//   tourController.updateTourType
// );
// router.patch(
//   "/tour-types/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   tourController.deleteTourType
// );
/* -------------tour routes-------------------*/
router.get("/", tour_controller_1.tourController.getAllTours);
router.post("/create", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.tourController.createTour);
router.patch("/:id", (0, checkAuths_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.tourController.updateTour);
// router.delete(
//   "/:id",
//   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
//   tourController.deleteTour
// );
exports.TourRoutes = router;
//# sourceMappingURL=tour.route.js.map