import { startSession } from "mongoose";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Booking } from "../Booking/booking.model";
import { BOOKING_STATUS } from "../Booking/booking.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { ISSlCommerz } from "../../sslCommerz/sslCommerz.interface";
import { SSLService } from "../../sslCommerz/sslCommerz.service";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment not found. Please complete your payment to book your tour.",
      ""
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any)?.address;
  const userEmail = (booking?.user as any)?.email;
  const userName = (booking?.user as any)?.name;
  const userPhoneNumber = (booking?.user as any)?.phone;

  const sslPayload: ISSlCommerz = {
    address: userAddress,
    email: userEmail,
    name: userName,
    phone: userPhoneNumber,
    transactionId: payment.transactionId,
    amount: payment.amount,
  };

  const sslPayment = await SSLService.sslPayment(sslPayload);

  return {
    paymentURL: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  await session.startTransaction();

  try {
    const Updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { session, new: true }
    );

    if (!Updatepayment) {
      throw new Error("Payment not found with the given transaction ID.");
    }

    await Booking.findOneAndUpdate(
      Updatepayment.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return {
      success: true,
      message: "Payment Completed Successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// fail

const failPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  await session.startTransaction();

  try {
    const Updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { session, new: true }
    );

    if (!Updatepayment) {
      throw new Error("Payment not found with the given transaction ID.");
    }

    await Booking.findOneAndUpdate(
      Updatepayment.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return {
      success: false,
      message: "Payment FAILD",
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// cancel

const cancelPayment = async (query: Record<string, string>) => {
  const session = await startSession();
  await session.startTransaction();

  try {
    const Updatepayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { session, new: true }
    );

    if (!Updatepayment) {
      throw new Error("Cancel the Booking Tour");
    }

    await Booking.findOneAndUpdate(
      Updatepayment.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    await session.endSession();

    return {
      success: false,
      message: "Payment Cancel",
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
};
