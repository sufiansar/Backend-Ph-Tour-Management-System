import crypto from "crypto";
import { redisClient } from "../../config/radis.confiq";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utility/sendMail";

const OTP_EXPIREATION = 2 * 60;

const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOtp = async (name: string, email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(404, "User not found", "");
  }

  //   if (user.isVerified) {
  //     throw new AppError(401, "You are already verified", "");
  //   }
  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIREATION,
    },
  });

  sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

export const OtpService = {
  sendOtp,
};
