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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utility/catchAsync");
const sendResponce_1 = require("../../utility/sendResponce");
const createUser = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { picture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const user = yield user_service_1.UserServices.createUser(payload);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "User Create Successfully",
        data: user,
    });
    // res.status(httpStatus.CREATED).json({
    //   message: "User Create Successfully",
    //   user,
    // });
}));
const updateUser = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user;
    const payload = Object.assign(Object.assign({}, req.body), { picture: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "User updeted Successfully",
        data: user,
    });
    // res.status(httpStatus.CREATED).json({
    //   message: "User Create Successfully",
    //   user,
    // });
}));
const getAllUser = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield user_service_1.UserServices.getAllUser(query);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Get-All User Retrived Successfully",
        data: result.data,
        meta: result.meta,
    });
    // res.status(StatusCodes.OK).json({
    //   success: true,
    //   message: "Get-All User Retrived Successfully",
    //   data: result,
    // });
}));
const getMe = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log(decodedToken);
    const result = yield user_service_1.UserServices.getMe(decodedToken.userId);
    console.log(result);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsycn)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserServices.getSingleUser(id);
    (0, sendResponce_1.sendResponse)(res, {
        success: true,
        successCode: http_status_codes_1.default.OK,
        message: "Get Single User Retrived Successfully",
        data: result.data,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
};
