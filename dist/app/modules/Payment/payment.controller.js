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
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utility/catchAsync");
const sendResponce_1 = require("../../utility/sendResponce");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const payments_service_1 = require("./payments.service");
const env_1 = require("../../config/env");
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const initPayment = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payments_service_1.PaymentService.initPayment(bookingId);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Payment  Successfully",
        data: result,
    });
}));
const successPayment = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payments_service_1.PaymentService.successPayment(query);
    if (result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`);
    }
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Payment  Successfully",
        data: result,
    });
}));
// fail
const failPayment = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payments_service_1.PaymentService.failPayment(query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`);
    }
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Payment Faild",
        data: result,
    });
}));
// Cancle
const cancelPayment = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payments_service_1.PaymentService.cancelPayment(query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}`);
    }
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Payment Cancle",
        data: result,
    });
}));
const getInvoiceDownloadUrl = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.params.paymentId;
    const invoiceUrl = yield payments_service_1.PaymentService.getInvoiceDownloadUrl(paymentId);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Invoice URL retrieved successfully",
        data: { invoiceUrl },
    });
}));
const paymentValidate = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sslCommerz_service_1.SSLService.sslCommerzValidation(req.body);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Payment validated successfully",
        data: null,
    });
}));
exports.PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    paymentValidate,
    getInvoiceDownloadUrl,
};
