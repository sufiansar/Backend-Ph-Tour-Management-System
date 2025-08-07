import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { StatsService } from "./stats.service";

const getUserStats = catchAsycn(async (req, res) => {
  const stats = await StatsService.getUserStats();
  sendResponse(res, {
    success: true,
    successCode: httpStatus.OK,
    message: "User stats retrieved successfully",
    data: stats,
  });
});

const getBookingStats = catchAsycn(async (req, res) => {
  const stats = await StatsService.getBookingStats();
  sendResponse(res, {
    success: true,
    successCode: httpStatus.OK,
    message: "Booking stats retrieved successfully",
    data: stats,
  });
});
const getTourStats = catchAsycn(async (req, res) => {
  const stats = await StatsService.getTourStats();
  sendResponse(res, {
    success: true,
    successCode: httpStatus.OK,
    message: "Tour stats retrieved successfully",
    data: stats,
  });
});
const getPaymentStats = catchAsycn(async (req, res) => {
  const stats = await StatsService.getPaymentStats();
  sendResponse(res, {
    success: true,
    successCode: httpStatus.OK,
    message: "Payment stats retrieved successfully",
    data: stats,
  });
});

export const StatsContoller = {
  getUserStats,
  getBookingStats,
  getTourStats,
  getPaymentStats,
};
