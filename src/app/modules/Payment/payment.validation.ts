import { z } from "zod";
import mongoose from "mongoose";
import { PAYMENT_STATUS } from "./payment.interface";

export const createPaymentZodSchema = z.object({
  body: z.object({
    booking: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid booking ID",
    }),
    transactionId: z.string().min(1, "Transaction ID is required"),
    amount: z.number().min(0, "Amount must be a positive number"),
    paymentGatewayData: z.any().optional(),
    status: z
      .enum([
        PAYMENT_STATUS.PAID,
        PAYMENT_STATUS.UNPAID,
        PAYMENT_STATUS.CANCELLED,
        PAYMENT_STATUS.FAILED,
        PAYMENT_STATUS.REFUNDED,
      ])
      .optional(),
    invoiceUrl: z.string().url("Invalid invoice URL").optional(),
  }),
});
