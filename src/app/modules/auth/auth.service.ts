import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, Isactive, Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpSuccessCode from "http-status-codes";
import bcryptjs from "bcryptjs";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utility/jwt";
import { envVars } from "../../config/env";
import {
  createNewaccessTokenWithRefreshToken,
  createUserToken,
} from "../../utility/user.tokens";
import { sendEmail } from "../../utility/sendMail";
import { name } from "ejs";
const credentialsLogin = async (payload: Partial<Iuser>) => {
  const { email, password } = payload;
  const isUserexit = await User.findOne({ email });
  if (!isUserexit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Dose not Exit", "");
  }

  const ispasswordMatch = await bcryptjs.compare(
    password as string,
    isUserexit.password as string
  );
  if (!ispasswordMatch) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "Incorrect Password", "");
  }
  // const jwtPayload = {
  //   email: isUserexit.email,
  //   userId: isUserexit._id,
  //   role: isUserexit.Role,
  // };
  // const accecToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET,
  //   envVars.JWT_EXPIREDATE
  // );
  // const refreshToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_REFRESH_SECRET,
  //   envVars.JWT_REFRESH_EXPIRES
  // );

  const userToken = createUserToken(isUserexit);

  const { password: pass, ...rest } = isUserexit.toObject();
  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccesessToken = await createNewaccessTokenWithRefreshToken(
    refreshToken
  );
  // console.log(refreshToken);

  // const verifyRefreshToken = verifyToken(
  //   refreshToken,
  //   envVars.JWT_REFRESH_SECRET
  // ) as JwtPayload;

  // const isUserexit = await User.findOne({ email: verifyRefreshToken.email });
  // if (!isUserexit) {
  //   throw new AppError(httpSuccessCode.BAD_REQUEST, "User Dose not Exit", "");
  // }

  // if (
  //   isUserexit.isactive === Isactive.BLOCKED ||
  //   isUserexit.isactive === Isactive.INACTIVE
  // ) {
  //   throw new AppError(httpSuccessCode.BAD_REQUEST, `User is ${Isactive}`, "");
  // }
  // if (isUserexit.isdeleted) {
  //   throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
  // }
  // const jwtPayload = {
  //   email: isUserexit.email,
  //   userId: isUserexit._id,
  //   role: isUserexit.Role,
  // };
  // const accecToken = generateToken(
  //   jwtPayload,
  //   envVars.JWT_ACCESS_SECRET,
  //   envVars.JWT_EXPIREDATE
  // );

  // const resetPassword = async (refreshToken: string) => {
  //   const newAccesessToken = await createNewaccessTokenWithRefreshToken(
  //     refreshToken
  //   );
  return {
    accessToken: newAccesessToken,
  };
};

const setPassword = async (userId: string, PlainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Not Found", "");
  }

  if (
    user.password &&
    user.Auth.some((providerObject) => providerObject.provider === "google")
  ) {
    throw new AppError(
      httpSuccessCode.BAD_REQUEST,
      "You Have already Set Password so You Can go nOw ",
      ""
    );
  }
  const hashPassword = await bcryptjs.hash(
    PlainPassword,
    Number(envVars.BCRYPT_SALT_ROUNT)
  );

  const credentialProvider: IAuthProvider = {
    provider: "credientials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.Auth, credentialProvider];

  user.password = hashPassword;
  user.Auth = auths;

  await user.save();
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(
      httpSuccessCode.UNAUTHORIZED,
      "You cannot reset your password",
      ""
    );
  }

  const user = await User.findById(decodedToken.userId).select("+password");

  if (!user) {
    throw new AppError(httpSuccessCode.NOT_FOUND, "User not found", "");
  }

  if (!payload.newPassword) {
    throw new AppError(
      httpSuccessCode.BAD_REQUEST,
      "New password is required",
      ""
    );
  }

  const hashPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUNT)
  );

  user.password = hashPassword;
  await user.save();
};

const forgotPassword = async (email: string) => {
  const isUserExit = await User.findOne({ email });

  if (!isUserExit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User does not exist", "");
  }

  if (
    isUserExit.isactive === Isactive.BLOCKED ||
    isUserExit.isactive === Isactive.INACTIVE
  ) {
    throw new AppError(
      httpSuccessCode.BAD_REQUEST,
      `User is ${isUserExit.isactive}`,
      ""
    );
  }

  if (isUserExit.isdeleted) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
  }
  if (!isUserExit.isVerified) {
    throw new AppError(403, "User Not Verified", "");
  }

  const jwtPayload = {
    userId: isUserExit._id,
    email: isUserExit.email,
    role: isUserExit.Role,
  };

  const resetLink = Jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVars.FONTEND_URL}/reset-Password?id=${isUserExit._id}&token=${resetLink}`;
  sendEmail({
    to: isUserExit.email,
    subject: "Forget Password",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExit.name,
      resetUILink,
    },
  });
};

const changePassword = async (
  decodedToken: JwtPayload,
  newPassword: string,
  oldPassword: string
) => {
  const user = await User.findById(decodedToken.userId);
  console.log(newPassword);
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(
      httpSuccessCode.UNAUTHORIZED,
      "Passaword does not mathch Try Agin",
      ""
    );
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNT)
  );
  user!.save();
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  forgotPassword,
  setPassword,
};
