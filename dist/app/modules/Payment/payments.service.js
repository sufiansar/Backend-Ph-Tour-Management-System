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
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const payment_model_1 = require("./payment.model");
const payment_interface_1 = require("./payment.interface");
const booking_model_1 = require("../Booking/booking.model");
const booking_interface_1 = require("../Booking/booking.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const sendMail_1 = require("../../utility/sendMail");
const generatePDF_1 = require("../../utility/generatePDF");
const cloudinary_1 = require("../../config/cloudinary");
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found. Please complete your payment to book your tour.", "");
    }
    const booking = yield booking_model_1.Booking.findById(payment.booking);
    const userAddress = (_a = booking === null || booking === void 0 ? void 0 : booking.user) === null || _a === void 0 ? void 0 : _a.address;
    const userEmail = (_b = booking === null || booking === void 0 ? void 0 : booking.user) === null || _b === void 0 ? void 0 : _b.email;
    const userName = (_c = booking === null || booking === void 0 ? void 0 : booking.user) === null || _c === void 0 ? void 0 : _c.name;
    const userPhoneNumber = (_d = booking === null || booking === void 0 ? void 0 : booking.user) === null || _d === void 0 ? void 0 : _d.phone;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        name: userName,
        phone: userPhoneNumber,
        transactionId: payment.transactionId,
        amount: payment.amount,
    };
    const sslPayment = yield sslCommerz_service_1.SSLService.sslPayment(sslPayload);
    return {
        paymentURL: sslPayment.GatewayPageURL,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    yield session.startTransaction();
    try {
        const Updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { session, new: true });
        if (!Updatepayment) {
            throw new Error("Payment not found with the given transaction ID.");
        }
        const updatedBooking = yield booking_model_1.Booking.findOneAndUpdate(Updatepayment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { runValidators: true, session })
            .populate("tour", "title")
            .populate("user", "name email");
        if (!updatedBooking) {
            throw new AppError_1.default(401, "Booking not found", "");
        }
        const invoiceData = {
            bookingDate: updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: Updatepayment.amount,
            tourTitle: updatedBooking.tour.title,
            transactionId: Updatepayment.transactionId,
            userName: updatedBooking.user.name,
        };
        const pdfBuffer = yield (0, generatePDF_1.generatePdf)(invoiceData);
        const cloudinaryResult = yield (0, cloudinary_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        if (!cloudinaryResult) {
            throw new AppError_1.default(401, "Error uploading pdf");
        }
        yield payment_model_1.Payment.findByIdAndUpdate(Updatepayment._id, { invoiceUrl: cloudinaryResult.secure_url }, { runValidators: true, session });
        yield (0, sendMail_1.sendEmail)({
            to: updatedBooking.user.email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        yield session.commitTransaction();
        yield session.endSession();
        return {
            success: true,
            message: "Payment Completed Successfully",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
// fail
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    yield session.startTransaction();
    try {
        const Updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { session, new: true });
        if (!Updatepayment) {
            throw new Error("Payment not found with the given transaction ID.");
        }
        yield booking_model_1.Booking.findOneAndUpdate(Updatepayment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return {
            success: false,
            message: "Payment FAILD",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
// cancel
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    yield session.startTransaction();
    try {
        const Updatepayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { session, new: true });
        if (!Updatepayment) {
            throw new Error("Cancel the Booking Tour");
        }
        yield booking_model_1.Booking.findOneAndUpdate(Updatepayment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction();
        yield session.endSession();
        return {
            success: false,
            message: "Payment Cancel",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default(404, "Payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(404, "Invoice URL not found for this payment");
    }
    return payment.invoiceUrl;
});
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    getInvoiceDownloadUrl,
    initPayment,
};
