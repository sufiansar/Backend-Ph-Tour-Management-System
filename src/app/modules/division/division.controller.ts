import { Request, Response } from "express";
import { sendResponse } from "../../utility/sendResponce";
import httpStatus from "http-status-codes";
import { catchAsycn } from "../../utility/catchAsync";
import { divisionService } from "./division.service";
import { IDivision } from "./division.interface";

const createDivision = catchAsycn(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const division = await divisionService.createDivision(payload);
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
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const id = req.params.id;

  const result = await divisionService.updateDivision(id, payload);
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
