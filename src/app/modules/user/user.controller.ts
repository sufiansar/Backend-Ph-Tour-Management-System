import { NextFunction, Request, Response } from "express";
import httpStatus, { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import { verifyToken } from "../../utility/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsycn(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "User Create Successfully",
    data: user,
  });
  // res.status(httpStatus.CREATED).json({
  //   message: "User Create Successfully",
  //   user,
  // });
});

const updateUser = catchAsycn(async (req: Request, res: Response) => {
  const userId = req.params.id;
  // const token = req.headers.authorization;
  // const verifiedToken = verifyToken(
  //   token as string,
  //   envVars.JWT_ACCESS_SECRET
  // ) as JwtPayload;
  const verifiedToken = req.user;
  const payload = req.body;
  const user = await UserServices.updateUser(userId, payload, verifiedToken);
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "User updeted Successfully",
    data: user,
  });
  // res.status(httpStatus.CREATED).json({
  //   message: "User Create Successfully",
  //   user,
  // });
});
const getAllUser = catchAsycn(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUser();

    sendResponse(res, {
      success: true,
      successCode: httpStatus.OK,
      message: "Get-All User Retrived Successfully",
      data: result.data,
      meta: result.meta,
    });
    // res.status(StatusCodes.OK).json({
    //   success: true,
    //   message: "Get-All User Retrived Successfully",
    //   data: result,
    // });
  }
);

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
};
