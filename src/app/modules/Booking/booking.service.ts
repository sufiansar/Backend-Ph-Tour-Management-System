import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../Payment/payment.model";
import { PAYMENT_STATUS } from "../Payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { startSession } from "mongoose";
import { SSLService } from "../../sslCommerz/sslCommerz.service";
import { ISSlCommerz } from "../../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utility/getTranacionId";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();
  const session = await startSession();
  await session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please provide both phone number and address",
        ""
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour) {
      throw new AppError(httpStatus.BAD_REQUEST, "Tour not found", "");
    }

    const guestCount = Number(payload.guestCount || 1);
    const amount = Number(tour.costFrom) * guestCount;

    const [booking] = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate({ path: "user", select: "name email address" })
      .populate({ path: "tour", select: "title" })
      .populate("payment");

    const userAdress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userName = (updatedBooking?.user as any).name;
    const userphoneNumber = (updatedBooking?.user as any).phone;

    const sslPayload: ISSlCommerz = {
      address: userAdress,
      email: userEmail,
      name: userName,
      phone: userphoneNumber,
      transactionId: transactionId,
      amount: amount,
    };

    const sslPayment = await SSLService.sslPayment(sslPayload);

    await session.commitTransaction();
    await session.endSession();

    return {
      payment: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const BookingService = {
  createBooking,
};
