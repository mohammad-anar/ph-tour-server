import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interfaces";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";

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
  const hashedPassword = await bcrypt.hash(password as string, 10);

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

export const UserServices = { createUser, getAllUsers };
