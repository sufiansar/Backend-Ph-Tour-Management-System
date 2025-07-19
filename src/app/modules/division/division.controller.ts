import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { catchAsycn } from "../../utility/catchAsync";
import { divisionService } from "./division.service";

const createDivision = catchAsycn(async (req: Request, res: Response) => {
  const division = await divisionService.createDivision(req.body);
  sendResponse(res, {
    success: true,
    successCode: httpStatus.CREATED,
    message: "Division Create Successfully",
    data: division,
  });
});

const getAllDivisions = catchAsycn(async (req: Request, res: Response) => {
  const result = await divisionService.getAllDivisions();
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleDivision = catchAsycn(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await divisionService.getSingleDivision(slug);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Divisions retrieved",
    data: result.data,
  });
});

const updateDivision = catchAsycn(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await divisionService.updateDivision(id, req.body);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Division updated",
    data: result,
  });
});

const deleteDivision = catchAsycn(async (req: Request, res: Response) => {
  const result = await divisionService.deleteDivision(req.params.id);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

export const divisionController = {
  createDivision,
  updateDivision,
  getAllDivisions,
  getSingleDivision,
  deleteDivision,
};
