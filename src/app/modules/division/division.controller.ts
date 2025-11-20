import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { DivisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.createDivision(req.body);
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
const updateDivision = catchAsync(async (req: Request, res: Response) => {


  const result = await DivisionService.updateDivision(req.body);
  sendResponse(res, {
    statusCode: 201, 
    success: true,
    message: "All division retrieve successfully!",
    data: result,
  });
});
const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.deleteDivision(req.body);
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
};
