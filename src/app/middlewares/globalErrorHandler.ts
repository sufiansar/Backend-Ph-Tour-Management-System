import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { handelDuplicateError } from "../helpers/handelDuplicateError";
import { handelValidationError } from "../helpers/handelValidationError";
import { handelCastError } from "../helpers/handelCastError";
import { handelZodError } from "../helpers/handelZodError";
import { deleteImageFromCLoudinary } from "../config/cloudinary";

export const globalErrorHander = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "Development") {
    console.log(err);
  }

  if (req.file) {
    await deleteImageFromCLoudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imagesUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path
    );
    await Promise.all(imagesUrl.map((url) => deleteImageFromCLoudinary(url)));
  }
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSource: any = [];

  //  Duplicate Key Error (MongoDB)
  if (err.code === 11000) {
    const simplifiedError = handelDuplicateError(err);
    statusCode = simplifiedError.StatusCodes;
    message = simplifiedError.message;
    // statusCode = 400;
    // const matchArray = err.message.match(/"([^"]*)"/);
    // const duplicatedKey = matchArray ? matchArray[1] : "Unknown field";
    // message = `Duplicate Key Error: ${duplicatedKey}`;
  }

  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handelValidationError(err);
    statusCode = simplifiedError.StatusCodes;
    errorSource = simplifiedError.errorSource;
    message = simplifiedError.message;
  }

  // Cast Error (Invalid ObjectId)
  else if (err.name === "CastError") {
    const simplifiedError = handelCastError(err);
    statusCode = simplifiedError.StatusCodes;
    message = simplifiedError.message;
  }

  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handelZodError(err);
    statusCode = simplifiedError.StatusCodes;
    errorSource = simplifiedError.errorSource;
    message = simplifiedError.message;
  }

  //  AppError (Custom)
  else if (err instanceof AppError) {
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
    err: envVars.NODE_ENV === "Development" ? err : null,
    stack: envVars.NODE_ENV === "Development" ? err.stack : undefined,
  });
};
