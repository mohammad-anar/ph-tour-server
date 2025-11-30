"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// create users
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new AppError(httpstatus.BAD_REQUEST, "Something went wrong!!!");
//     const user = await UserServices.createUser(req.body);
//     res.status(httpstatus.CREATED).json({
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error: any) {
//     console.log(error);
//     next(error);
//   }
// };
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await user_service_1.UserServices.createUser(req.body);
    // res.status(httpstatus.CREATED).json({
    //   success: true,
    //   message: "User created successfully",
    //   data: user,
    // });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User created successfully",
        data: user,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization;
    // // verify token assert form checkAuth
    const verifiedToken = req.user;
    // update user
    const user = await user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    // res.status(httpstatus.CREATED).json({
    //   success: true,
    //   message: "User created successfully",
    //   data: user,
    // });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User updated successfully!!",
        data: user,
    });
});
// get all users
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await user_service_1.UserServices.getAllUsers();
    // res.status(httpstatus.OK).json({
    //   success: true,
    //   message: "All user retrive successfully",
    //   data: users,
    // });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All users retrieve successfully!!",
        data: data?.data,
        meta: data?.meta,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const data = await user_service_1.UserServices.getMe(user?.userId);
    // res.status(httpstatus.OK).json({
    //   success: true,
    //   message: "All user retrive successfully",
    //   data: users,
    // });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your profile retrieve successfully!!",
        data: data?.data,
    });
});
exports.UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
};
// app - route middleware match
// router - controller mathc
// controller - service
// service - model - database interaction
//# sourceMappingURL=user.controller.js.map