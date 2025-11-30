"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interfaces_1 = require("./user.interfaces");
const user_model_1 = require("./user.model");
// create user
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    // check this user before create
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User with this email already exist!!");
    }
    // hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // make auth provider
    const authProvider = {
        provider: "Credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest,
    });
    return user;
};
// update user
const updateUser = async (userId, payload, decodedToken) => {
    if (decodedToken.role === user_interfaces_1.Role.USER || decodedToken.role === user_interfaces_1.Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(403, "You are not authorized");
        }
    }
    const isUserExist = await user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // if (
    //   decodedToken.role === Role.USER &&
    //   isUserExist.role === Role.SUPER_ADMIN
    // ) {
    //   throw new AppError(403, "You are not authorized");
    // }
    // if (ifUserExist.isDeleted || ifUserExist.isActive === IsActive.BLOCKED) {
    //   throw new AppError(httpStatus.BAD_REQUEST, "Can't update this user!!");
    // }
    /**
     * email - can not update
     * name, phone, password, address
     * password- re hashing
     * only admin and super admin - role, isVerified, isDeleted ....
     * */
    if (payload.role) {
        // check role and prevent for user and guide to update
        if (decodedToken.role === user_interfaces_1.Role.USER || decodedToken.role === user_interfaces_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        // check admin or super_admin
        if (payload.role === user_interfaces_1.Role.SUPER_ADMIN && decodedToken.role === user_interfaces_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (isUserExist.email === decodedToken.email) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can't update this property!");
        }
    }
    // check isActive, and isDeleted nad isVerified to throw error for USER and GUIDE role
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interfaces_1.Role.USER || decodedToken.role === user_interfaces_1.Role.GUIDE) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // then update the user
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
};
// get all users
const getAllUsers = async () => {
    const users = await user_model_1.User.find({});
    const totalUsers = await user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};
const getMe = async (userId) => {
    const users = await user_model_1.User.findById(userId).select("-password");
    return {
        data: users,
    };
};
exports.UserServices = { createUser, getAllUsers, updateUser, getMe };
//# sourceMappingURL=user.service.js.map