import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { Isactive, Iuser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import httpSuccessCode from "http-status-codes";
import AppError from "../errorHelpers/AppError";

export const createUserToken = (user: Partial<Iuser>) => {
  const jwtPayload = {
    email: user.email,
    userId: user._id,
    role: user.Role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_EXPIREDATE
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewaccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifyRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserexit = await User.findOne({ email: verifyRefreshToken.email });
  if (!isUserexit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Dose not Exit", "");
  }

  if (
    isUserexit.isactive === Isactive.BLOCKED ||
    isUserexit.isactive === Isactive.INACTIVE
  ) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, `User is ${Isactive}`, "");
  }
  if (isUserexit.isdeleted) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User deleted", "");
  }
  const jwtPayload = {
    email: isUserexit.email,
    userId: isUserexit._id,
    role: isUserexit.Role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_EXPIREDATE
  );
  return accessToken;
};
