"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const userToken_1 = require("../../utils/userToken");
const user_interfaces_1 = require("../user/user.interfaces");
const user_model_1 = require("../user/user.model");
const credentialsLogin = async (payload) => {
    const { email, password } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    // check this user before create
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User with this email not exist!!");
    }
    const isPasswordmatch = await bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordmatch) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password doesnot match!");
    }
    // generate tokens
    const { accessToken, refreshToken } = (0, userToken_1.createUserTokens)(isUserExist);
    // delete password field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();
    return { accessToken, refreshToken, user: rest };
};
// refresh token
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userToken_1.getNewAccessTokenWithRefreshToken)(refreshToken);
    return { accessToken: newAccessToken };
};
// reset password
const resetPassword = async (newPassword, id, decodedToken) => {
    if (id !== decodedToken.userId) {
        throw new AppError_1.default(403, "You can't reset this password!");
    }
    const user = await user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(404, "User not found!");
    }
    // hash new password
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // save the user
    user?.save();
    return true;
};
const changePassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user?.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old password does not match.");
    }
    // hash new password
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // save the user
    user?.save();
    return true;
};
const setPassword = async (userId, plainPassword) => {
    const user = (await user_model_1.User.findById(userId));
    console.log({ user });
    if (!user) {
        throw new AppError_1.default(404, "User not found.");
    }
    if (user?.password &&
        user.auth.some((providerObject) => providerObject.provider === "Google")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already password. Please reset or change your password from your profile");
    }
    const hashedPassword = await bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const auth = [
        ...user.auth,
        { provider: "Credentials", providerId: user.email },
    ];
    user.password = hashedPassword;
    user.auth = auth;
    await user.save();
    return user;
};
const forgotPassword = async (email) => {
    const isUserExist = (await user_model_1.User.findOne({ email: email }));
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist.");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is not verified`);
    }
    if (isUserExist.isActive === user_interfaces_1.IsActive.BLOCKED ||
        isUserExist.isActive === user_interfaces_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is deleted`);
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUrl = `${env_1.envVars.FRONT_END_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password reset",
        templateName: "forgetPasswordEmailTemplate",
        templateData: {
            name: isUserExist.name,
            resetLink: resetUrl,
        },
    });
};
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
};
//# sourceMappingURL=auth.service.js.map