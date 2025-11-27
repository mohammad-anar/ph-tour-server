import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { tourService } from "./tour.service";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { ITour } from "./tour.interfaces";

// create tour
const createTour = catchAsync(async (req: Request, res: Response) => {
  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file?.path),
  };

  const result = await tourService.createTour(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour created successfully",
    data: result,
  });
});
// update tour
const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const payload: ITour = {
    ...req.body,
    images: (req.files as Express.Multer.File[])?.map((file) => file?.path),
  };
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id does not provided.");
  }
  const result = await tourService.updateTour(id, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

// get all tours
const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await tourService.getAllTours(query as Record<string, string>);

  console.log(result, "see where result in tour get contorller");

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour retrieve successfully",
    data: result.data,
    meta: result.meta,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await tourService.createTourType({ name });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type created successfully",
    data: result,
  });
});

export const tourController = {
  createTour,
  getAllTours,
  createTourType,
  updateTour,
};
