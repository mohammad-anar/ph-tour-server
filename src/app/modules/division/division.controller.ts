import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { DivisionService } from "./division.service";
import { IDivision } from "./division.interface";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req?.file?.path,
  };
  const result = await DivisionService.createDivision(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Division created successfully!",
    data: result,
  });
});
const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All division retrieve successfully!",
    data: result,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Division retrive successfully.",
    data: result,
  });
});
const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

    const payload: IDivision = {
      ...req.body,
      thumbnail: req?.file?.path,
    };
  const result = await DivisionService.updateDivision(id as string, payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All division retrieve successfully!",
    data: result,
  });
});
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.deleteDivision(req.params.id as string);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "All division retrieve successfully!",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  updateDivision,
  deleteDivision,
  getAllDivisions,
  getSingleDivision,
};
