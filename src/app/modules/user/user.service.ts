import bycrypt from "bcrypt";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, Iuser } from "./user.interface";
import { User } from "./user.model";
import httpSuccessCode from "http-status-codes";

const createUser = async (payload: Partial<Iuser>) => {
  const { email, password, ...rest } = payload;
  const isEmailExit = await User.findOne({ email });
  if (isEmailExit) {
    throw new AppError(httpSuccessCode.BAD_REQUEST, "User Already Exit", "");
  }

  const hashPassword = await bycrypt.hash(password as string, 10);

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
};
