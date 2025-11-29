import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { OTPService } from "./otp.service";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  const { email, name } = req.body;

  await OTPService.sendOTP(email, name);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP sent successfully. Please check your email",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await OTPService.verifyOTP(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verified successfully.",
    data: null,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
