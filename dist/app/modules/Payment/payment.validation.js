"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentZodSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const payment_interface_1 = require("./payment.interface");
exports.createPaymentZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        booking: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: "Invalid booking ID",
        }),
        transactionId: zod_1.z.string().min(1, "Transaction ID is required"),
        amount: zod_1.z.number().min(0, "Amount must be a positive number"),
        paymentGatewayData: zod_1.z.any().optional(),
        status: zod_1.z
            .enum([
            payment_interface_1.PAYMENT_STATUS.PAID,
            payment_interface_1.PAYMENT_STATUS.UNPAID,
            payment_interface_1.PAYMENT_STATUS.CANCELLED,
            payment_interface_1.PAYMENT_STATUS.FAILED,
            payment_interface_1.PAYMENT_STATUS.REFUNDED,
        ])
            .optional(),
        invoiceUrl: zod_1.z.string().url("Invalid invoice URL").optional(),
    }),
});
