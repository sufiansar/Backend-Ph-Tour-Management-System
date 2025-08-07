"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../Payment/payment.model");
const payment_interface_1 = require("../Payment/payment.interface");
const tour_model_1 = require("../tour/tour.model");
const mongoose_1 = require("mongoose");
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const getTranacionId_1 = require("../../utility/getTranacionId");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, getTranacionId_1.getTransactionId)();
    const session = yield (0, mongoose_1.startSession)();
    yield session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please provide both phone number and address", "");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!tour) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour not found", "");
        }
        const guestCount = Number(payload.guestCount || 1);
        const amount = Number(tour.costFrom) * guestCount;
        const [booking] = yield booking_model_1.Booking.create([
            Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload),
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId,
                amount,
            },
        ], { session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate(booking._id, {
            payment: payment[0]._id,
        }, { new: true, runValidators: true, session })
            .populate({ path: "user", select: "name email address" })
            .populate({ path: "tour", select: "title" })
            .populate("payment");
        const userAdress = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address;
        const userEmail = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email;
        const userName = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name;
        const userphoneNumber = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phone;
        const sslPayload = {
            address: userAdress,
            email: userEmail,
            name: userName,
            phone: userphoneNumber,
            transactionId: transactionId,
            amount: amount,
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPayment(sslPayload);
        yield session.commitTransaction();
        yield session.endSession();
        return {
            payment: sslPayment.GatewayPageURL,
            booking: updatedBooking,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
exports.BookingService = {
    createBooking,
};
