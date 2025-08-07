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
exports.OtpController = void 0;
const catchAsync_1 = require("../../utility/catchAsync");
const sendResponce_1 = require("../../utility/sendResponce");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const otp_service_1 = require("./otp.service");
const sendOtp = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    yield otp_service_1.OtpService.sendOtp(name, email);
    yield (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Otp Sent  Successfully",
        data: null,
    });
}));
const verifyOtp = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Otp Sent  Successfully",
        data: null,
    });
}));
exports.OtpController = {
    sendOtp,
    verifyOtp,
};
