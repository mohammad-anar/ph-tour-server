import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  // check this user before create
  if (!isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User with this email not exist!!"
    );
  }

  const isPasswordmatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordmatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password doesnot match!");
  }

  return isUserExist;
};

export const AuthServices = { credentialsLogin };
