import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { StatsService } from "./stats.service";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getUserStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users stats retrieve successfully",
    data: stats,
  });
});
const getTourStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getTourStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tour stats retrieve successfully",
    data: stats,
  });
});

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getBookingStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking stats retrieve successfully",
    data: stats,
  });
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await StatsService.getPaymentStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment stats retrieve successfully",
    data: stats,
  });
});

export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
