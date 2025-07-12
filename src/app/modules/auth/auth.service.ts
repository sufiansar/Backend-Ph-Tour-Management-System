import AppError from "../../errorHelpers/AppError";
import { Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpSuccessCode from "http-status-codes";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { generateToken } from "../../utility/jwt";
import { envVars } from "../../../config/env";
const credentialsLogin = async (payload: Partial<Iuser>) => {
  const { email, password } = payload;
  const isUserexit = await User.findOne({ email });
  if (!isUserexit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Dose not Exit", "");
  }

  const passwordMatch = bcryptjs.compare(
    password as string,
    isUserexit.password as string
  );
  if (!passwordMatch) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "Incorrect Password", "");
  }
  const jwtPayload = {
    email: isUserexit.email,
    userId: isUserexit._id,
    role: isUserexit.Role,
  };
  const accecToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_EXPIREDATE
  );
  return {
    accecToken,
  };
};

export const AuthServices = {
  credentialsLogin,
};
