import { NextFunction, Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";

import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Login Succesfully",
      data: loginInfo,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
};
