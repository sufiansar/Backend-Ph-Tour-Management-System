import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHander = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something Went Wrong`;

  if (err instanceof AppError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    message,
    err,
    stack: envVars.NODE_ENV === "Development" ? err.stack : null,
  });
};
