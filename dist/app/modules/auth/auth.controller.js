"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const userToken_1 = require("../../utils/userToken");
const auth_service_1 = require("./auth.service");
const passport_1 = __importDefault(require("passport"));
// credentials login
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    passport_1.default.authenticate("local", async (error, user, info) => {
        // console.log(error, "see where login error");
        if (error) {
            // throw new AppError(401, error);
            return next(new AppError_1.default(401, info?.message || error));
        }
        if (!user) {
            return next(new AppError_1.default(401, info?.message || "Password doesn't match!"));
        }
        const userTokens = (0, userToken_1.createUserTokens)(user);
        // delete user.toObject().password;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = user.toObject();
        (0, setCookie_1.setAuthCookies)(res, userTokens);
        //   send response
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
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
});
// access token with refresh token
const getNewAccessToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token received form cookie.");
    }
    const tokenInfo = await auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    // set access token to browser cookies
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    (0, setCookie_1.setAuthCookies)(res, tokenInfo);
    //   send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New accessToken retrieve successfully",
        data: tokenInfo,
    });
});
// logout
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
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
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User logout successfully",
        data: null,
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    //   send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password changed successfully.",
        data: null,
    });
});
// reset password
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { newPassword, id } = req.body;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.resetPassword(newPassword, id, decodedToken);
    //   send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset successfully.",
        data: null,
    });
});
const setPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { password } = req.body;
    const decodedToken = req.user;
    await auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    //   send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password changed successfully.",
        data: null,
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    await auth_service_1.AuthServices.forgotPassword(email);
    //   send response
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Email sent successfully.",
        data: null,
    });
});
// google callback controller
const googleCallbackController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    let redirectTo = req.query.state ? req.query.state : "/";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo?.slice(1);
    }
    // passport js sent this req.user from passport config file which we pass in done function.
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    const tokenInfo = (0, userToken_1.createUserTokens)(user);
    (0, setCookie_1.setAuthCookies)(res, tokenInfo);
    //   send response
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpstatus.OK,
    //   message: "Password changed successfully.",
    //   data: null,
    // });
    // dont need to send response. just redirect to frontend url
    res.redirect(`${env_1.envVars.FRONT_END_URL}/${redirectTo}`);
});
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
    googleCallbackController,
};
//# sourceMappingURL=auth.controller.js.map