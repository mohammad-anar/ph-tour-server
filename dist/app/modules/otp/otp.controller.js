"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const otp_service_1 = require("./otp.service");
const sendOTP = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log(req.body);
    const { email, name } = req.body;
    await otp_service_1.OTPService.sendOTP(email, name);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "OTP sent successfully. Please check your email",
        data: null,
    });
});
const verifyOTP = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, otp } = req.body;
    await otp_service_1.OTPService.verifyOTP(email, otp);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "OTP verified successfully.",
        data: null,
    });
});
exports.OTPController = {
    sendOTP,
    verifyOTP,
};
//# sourceMappingURL=otp.controller.js.map