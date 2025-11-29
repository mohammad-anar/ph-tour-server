import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60; //2 MINUTES

const generateOtp = (length = 6) => {
  // 6 digit otp
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(403, "User not found with this email");
  }
  if (user?.isVerified) {
    throw new AppError(401, "You are already verified");
  }
  //
  await redisClient.set(redisKey, otp, {
    expiration: { type: "EX", value: OTP_EXPIRATION },
  });
  //
  await sendEmail({
    to: email,
    subject: "Your OTP code",
    templateName: "otp",
    templateData: { name: name, otp: otp },
  });
  return null;
};
const verifyOTP = async (email: string, otp: string) => {
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(403, "User not found with this email");
  }
  if (user?.isVerified) {
    throw new AppError(401, "You are already verified");
  }

  if (savedOtp !== otp) {
    throw new AppError(401, "Invalid otp");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey),
  ]);

  return null;
};

export const OTPService = { sendOTP, verifyOTP };
