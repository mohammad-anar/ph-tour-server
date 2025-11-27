import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import { AuthServices } from "./auth.service";
import passport from "passport";

// credentials login
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      // console.log(error, "see where login error");

      if (error) {
        // throw new AppError(401, error);
        return next(new AppError(401, info?.message || error));
      }

      if (!user) {
        return next(
          new AppError(401, info?.message || "Password doesn't match!")
        );
      }

      const userTokens = createUserTokens(user);

      // delete user.toObject().password;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user.toObject();

      setAuthCookies(res, userTokens);
      //   send response
      sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User loggedin successfully",
        data: {
          ...userTokens,
          user: rest,
        },
      });
    })(req, res, next);
    // set refresh token and accesstoken to browser cookies
    // setAuthCookies(res,{accessToken: loginInfo.accessToken});
    // setAuthCookies(res,{refreshToken: loginInfo.refreshToken});
  }
);

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
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Password changed successfully.",
    data: null,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(
    oldPassword,
    newPassword,
    decodedToken as JwtPayload
  );

  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Password changed successfully.",
    data: null,
  });
});
const setPassword = catchAsync(async (req: Request, res: Response) => {
  const { password } = req.body;
  const decodedToken = req.user as JwtPayload;

  await AuthServices.setPassword(decodedToken.userId, password);

  //   send response
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Password changed successfully.",
    data: null,
  });
});
// google callback controller
const googleCallbackController = catchAsync(
  async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? req.query.state : ("/" as string);

    if ((redirectTo as string).startsWith("/")) {
      redirectTo = (redirectTo as string)?.slice(1);
    }
    // passport js sent this req.user from passport config file which we pass in done function.
    const user = req.user;

    if (!user) {
      throw new AppError(httpstatus.NOT_FOUND, "User not found!");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookies(res, tokenInfo);
    //   send response
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpstatus.OK,
    //   message: "Password changed successfully.",
    //   data: null,
    // });

    // dont need to send response. just redirect to frontend url
    res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  changePassword,
  setPassword,
  googleCallbackController,
};
