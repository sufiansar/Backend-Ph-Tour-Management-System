import { Request, Response } from "express";
import { catchAsycn } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponce";
import { TourService } from "./tour.service";
import { Itour } from "./tour.interface";

const createTour = catchAsycn(async (req: Request, res: Response) => {
  const payload: Itour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const result = await TourService.createTour(payload);
  sendResponse(res, {
    successCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});

const getAllTours = catchAsycn(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTour = catchAsycn(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await TourService.getSingleTour(slug);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: " Single Tour retrieved successfully",
    data: result.data,
  });
});

const updateTour = catchAsycn(async (req: Request, res: Response) => {
  const payload: Itour = {
    ...req.body,
    images: (req.files as Express.Multer.File[]).map((file) => file.path),
  };
  const result = await TourService.updateTour(req.params.id, payload);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsycn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour deleted successfully",
    data: result,
  });
});
const getAllTourTypes = catchAsycn(async (req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes();
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});

const getSingleTourType = catchAsycn(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.getSingleTourType(id);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour types retrieved successfully",
    data: result,
  });
});
const createTourType = catchAsycn(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await TourService.createTourType(name);
  sendResponse(res, {
    successCode: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

const updateTourType = catchAsycn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await TourService.updateTourType(id, name);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
const deleteTourType = catchAsycn(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    successCode: 200,
    success: true,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  createTourType,
  getAllTourTypes,
  deleteTourType,
  updateTourType,
  getAllTours,
  updateTour,
  deleteTour,
  getSingleTour,
  getSingleTourType,
};
