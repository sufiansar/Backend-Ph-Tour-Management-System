import { Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { PaymentService } from "./payments.service";
import { envVars } from "../../config/env";

const initPayment = catchAsycn(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await PaymentService.initPayment(bookingId as string);

  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Payment  Successfully",
    data: result,
  });
});

const successPayment = catchAsycn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`
    );
  }
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Payment  Successfully",
    data: result,
  });
});

// fail

const failPayment = catchAsycn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.failPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`
    );
  }
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Payment Faild",
    data: result,
  });
});

// Cancle
const cancelPayment = catchAsycn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.cancelPayment(
    query as Record<string, string>
  );

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`
    );
  }
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Payment Cancle",
    data: result,
  });
});
export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
