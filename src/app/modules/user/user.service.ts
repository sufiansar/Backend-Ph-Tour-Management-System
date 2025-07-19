import bycrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, Iuser, Role } from "./user.interface";
import { User } from "./user.model";
import httpSuccessCode from "http-status-codes";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<Iuser>) => {
  const { email, password, ...rest } = payload;
  const isEmailExit = await User.findOne({ email });
  if (isEmailExit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Already Exit", "");
  }

  const hashPassword = await bycrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUNT)
  );

  const authProvider: IAuthProvider = {
    provider: "credientials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashPassword,
    Auth: [authProvider],
    ...rest,
  });

  return {
    user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<Iuser>,
  decodedToken: JwtPayload
) => {
  const isUserExit = await User.findById(userId);
  if (!isUserExit) {
    throw new AppError(httpSuccessCode.NOT_FOUND, "User Not Found", "");
  }

  if (payload.Role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpSuccessCode.FORBIDDEN,
        "You are Not Athorized",
        ""
      );
    }

    if (payload.Role === Role.SUPER_ADMIN || decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpSuccessCode.FORBIDDEN,
        "You are Not Athorized",
        ""
      );
    }
  }

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(
        httpSuccessCode.FORBIDDEN,
        "You are unauthorized to update another user's profile",
        ""
      );
    }
  }

  if (
    decodedToken.role === Role.ADMIN &&
    isUserExit.Role === Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpSuccessCode.FORBIDDEN,
      "You are not authorized to update a superadmin profile",
      ""
    );
  }

  if (payload.isactive || payload.isdeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpSuccessCode.FORBIDDEN,
        "You are Not Athorized",
        ""
      );
    }
  }
  if (payload.password) {
    payload.password = await bycrypt.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUNT
    );
  }
  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateUser;
};

const getAllUser = async () => {
  const user = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    data: user,
    meta: {
      total: totalUser,
    },
  };
};

export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
};
