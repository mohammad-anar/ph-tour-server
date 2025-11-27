import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import {
  createUserTokens,
  getNewAccessTokenWithRefreshToken,
} from "../../utils/userToken";
import { IAuthProvider, IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";

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
const changePassword = async (
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
const setPassword = async (userId: string, plainPassword: string) => {
  const user = (await User.findById(userId)) as JwtPayload;

  console.log({ user });
  if (!user) {
    throw new AppError(404, "User not found.");
  }

  if (
    user?.password &&
    user.auth.some(
      (providerObject: IAuthProvider) => providerObject.provider === "Google"
    )
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already password. Please reset or change your password from your profile"
    );
  }

  const hashedPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const auth: IAuthProvider[] = [
    ...user.auth,
    { provider: "Credentials", providerId: user.email },
  ];

  user.password = hashedPassword;
  user.auth = auth;
  await user.save();

  return user;
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
};
