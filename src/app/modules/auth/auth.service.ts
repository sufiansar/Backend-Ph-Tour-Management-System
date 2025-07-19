import AppError from "../../errorHelpers/AppError";
import { Isactive, Iuser } from "../user/user.interface";
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

const resetPassword = async (
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
};
