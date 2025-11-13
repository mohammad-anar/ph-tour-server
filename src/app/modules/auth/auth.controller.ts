import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpstatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookies } from "../../utils/setCookie";

// credentials login
const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);
  // set refresh token and accesstoken to browser cookies
  // setAuthCookies(res,{accessToken: loginInfo.accessToken});
  // setAuthCookies(res,{refreshToken: loginInfo.refreshToken});
  setAuthCookies(res, loginInfo);
  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User loggedin successfully",
    data: loginInfo,
  });
});

// access token with refresh token
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(
      httpstatus.BAD_REQUEST,
      "No refresh token received form cookie."
    );
  }
  const tokenInfo = await AuthServices.getNewAccessToken(
    refreshToken as string
  );

  // set access token to browser cookies
  // res.cookie("accessToken", tokenInfo.accessToken, {
  //   httpOnly: true,
  //   secure: false,
  // });
  setAuthCookies(res, tokenInfo);
  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "New accessToken retrieve successfully",
    data: tokenInfo,
  });
});

// logout
const logout = catchAsync(async (req: Request, res: Response) => {
  // remove access token form cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  // remove refresh token form cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User logout successfully",
    data: null,
  });
});
// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Password changed successfully.",
    data: null,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
