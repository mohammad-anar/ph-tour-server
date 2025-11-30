"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_interfaces_1 = require("../modules/user/user.interfaces");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "No token received. Login first.");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = await user_model_1.User.findOne({
            email: verifiedToken.email,
        });
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
        // check auths
        if (!authRoles.includes(verifiedToken.role))
            if (verifiedToken.role !== user_interfaces_1.Role.ADMIN ||
                verifiedToken.role !== user_interfaces_1.Role.SUPER_ADMIN) {
                throw new AppError_1.default(403, "You are not permitted to view users!");
            }
        req.user = verifiedToken;
        // next function
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuths.js.map