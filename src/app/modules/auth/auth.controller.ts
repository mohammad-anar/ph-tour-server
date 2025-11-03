import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User loggedin successfully",
    data: loginInfo,
  });
});

export const AuthControllers = { credentialsLogin };
