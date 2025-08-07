import mongoose from "mongoose";
import { IGenericError } from "../interfaces/error.typs";

export const handelCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: mongoose.Error.CastError
): IGenericError => {
  return {
    StatusCodes: 400,
    message: "Invalid MongoDB Object ID. Please send a valid ID.",
  };
};
