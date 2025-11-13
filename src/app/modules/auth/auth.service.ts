import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import {
  createUserTokens,
  getNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";
import { envVars } from "../../config/env";

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

  // generate tokens
  const { accessToken, refreshToken } = createUserTokens(isUserExist);

  // delete password field
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExist.toObject();

  return { accessToken, refreshToken, user: rest };
};

// refresh token
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await getNewAccessTokenWithRefreshToken(refreshToken);

  return { accessToken: newAccessToken };
};

// reset password
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match.");
  }

  // hash new password
  (user as IUser).password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  
  // save the user
  user?.save();

  return true;
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
