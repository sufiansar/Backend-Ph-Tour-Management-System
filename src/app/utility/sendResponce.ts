import { Response } from "express";

interface Imeta {
  total: number;
}
interface IsendResponse<T> {
  successCode: number;
  message: string;
  success: boolean;
  meta?: Imeta;
  data: T;
}

export const sendResponse = <T>(res: Response, data: IsendResponse<T>) => {
  res.status(data.successCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
