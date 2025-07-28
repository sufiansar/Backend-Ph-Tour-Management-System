import { Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { OtpService } from "./otp.service";

const sendOtp = catchAsycn(async (req: Request, res: Response) => {
  const { name, email } = req.body;

  await OtpService.sendOtp(name, email);

  await sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Otp Sent  Successfully",
    data: null,
  });
});

const verifyOtp = catchAsycn(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Otp Sent  Successfully",
    data: null,
  });
});

export const OtpController = {
  sendOtp,
  verifyOtp,
};
