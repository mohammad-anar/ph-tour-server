import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { tourService } from "./tour.service";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

// create tour
const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await tourService.createTour(req.body);

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
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id does not provided.");
  }
  const result = await tourService.updateTour(id, req.body);

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
const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await tourService.getAllTourTypes(
    query as Record<string, string>
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type retrieve successfully",
    data: result.data,
    meta: result.meta,
  });
});
const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const id = req.params.id;
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id not provided!");
  }
  const result = await tourService.updateTourType(id, payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type updated successfully",
    data: result,
  });
});
const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Id not provided!");
  }
  await tourService.deleteTourType(id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Tour type deleted successfully",
    data: null,
  });
});

export const tourController = {
  createTour,
  getAllTours,
  createTourType,
  updateTour,
  getAllTourTypes,
  updateTourType,
  deleteTourType
};
