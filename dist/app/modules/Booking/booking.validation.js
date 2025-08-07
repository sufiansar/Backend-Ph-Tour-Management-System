"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingZodSchema = void 0;
const zod_1 = require("zod");
const booking_interface_1 = require("./booking.interface");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createBookingZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: "Invalid user ID",
        }),
        tour: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
            message: "Invalid tour ID",
        }),
        payment: zod_1.z
            .string()
            .optional()
            .refine((val) => !val || mongoose_1.default.Types.ObjectId.isValid(val), {
            message: "Invalid payment ID",
        }),
        guestCount: zod_1.z.number().min(1, "Guest count must be at least 1"),
        status: zod_1.z
            .enum([
            booking_interface_1.BOOKING_STATUS.PENDING,
            booking_interface_1.BOOKING_STATUS.COMPLETE,
            booking_interface_1.BOOKING_STATUS.CANCEL,
            booking_interface_1.BOOKING_STATUS.PENDING,
        ])
            .optional(),
    }),
});
