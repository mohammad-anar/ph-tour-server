import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interfaces";
import { User } from "./user.model";

// create user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });

  // check this user before create
  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with this email already exist!!"
    );
  }

  // hash password
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // make auth provider
  const authProvider: IAuthProvider = {
    provider: "Credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auth: [authProvider],
    ...rest,
  });

  return user;
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

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
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    // check admin or super_admin
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (isUserExist.email === decodedToken.email) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can't update this property!"
      );
    }
  }

  // check isActive, and isDeleted nad isVerified to throw error for USER and GUIDE role
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // if want to update password then hashed it
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  // then update the user
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
const getMe = async (userId: string) => {
  const users = await User.findById(userId).select("-password");

  return {
    data: users,
  };
};

export const UserServices = { createUser, getAllUsers, updateUser, getMe };
