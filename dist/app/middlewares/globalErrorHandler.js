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
exports.globalErrorHander = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handelDuplicateError_1 = require("../helpers/handelDuplicateError");
const handelValidationError_1 = require("../helpers/handelValidationError");
const handelCastError_1 = require("../helpers/handelCastError");
const handelZodError_1 = require("../helpers/handelZodError");
const cloudinary_1 = require("../config/cloudinary");
const globalErrorHander = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_1.envVars.NODE_ENV === "Development") {
        console.log(err);
    }
    if (req.file) {
        yield (0, cloudinary_1.deleteImageFromCLoudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imagesUrl = req.files.map((file) => file.path);
        yield Promise.all(imagesUrl.map((url) => (0, cloudinary_1.deleteImageFromCLoudinary)(url)));
    }
    let statusCode = 500;
    let message = "Something went wrong";
    let errorSource = [];
    //  Duplicate Key Error (MongoDB)
    if (err.code === 11000) {
        const simplifiedError = (0, handelDuplicateError_1.handelDuplicateError)(err);
        statusCode = simplifiedError.StatusCodes;
        message = simplifiedError.message;
        // statusCode = 400;
        // const matchArray = err.message.match(/"([^"]*)"/);
        // const duplicatedKey = matchArray ? matchArray[1] : "Unknown field";
        // message = `Duplicate Key Error: ${duplicatedKey}`;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handelValidationError_1.handelValidationError)(err);
        statusCode = simplifiedError.StatusCodes;
        errorSource = simplifiedError.errorSource;
        message = simplifiedError.message;
    }
    // Cast Error (Invalid ObjectId)
    else if (err.name === "CastError") {
        const simplifiedError = (0, handelCastError_1.handelCastError)(err);
        statusCode = simplifiedError.StatusCodes;
        message = simplifiedError.message;
    }
    // Zod Error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handelZodError_1.handelZodError)(err);
        statusCode = simplifiedError.StatusCodes;
        errorSource = simplifiedError.errorSource;
        message = simplifiedError.message;
    }
    //  AppError (Custom)
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode || 400;
        message = err.message;
    }
    // Default JavaScript Error
    else if (err instanceof Error) {
        message = err.message;
    }
    //  Response
    res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        err: env_1.envVars.NODE_ENV === "Development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "Development" ? err.stack : undefined,
    });
});
exports.globalErrorHander = globalErrorHander;
