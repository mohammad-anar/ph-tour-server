import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  console.log({ decodedToken });

  const booking = await BookingService.createBooking(
    req.body,
    decodedToken.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully.",
    data: booking,
  });
});
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await BookingService.getAllBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieve successfully.",
    data: bookings,
  });
});
const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await BookingService.getUserBookings();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookings retrieve successfully.",
    data: bookings,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.getSingleBooking();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking retrieve successfully.",
    data: booking,
  });
});
const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await BookingService.updateBooking();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking updated successfully.",
    data: booking,
  });
});
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
  await BookingService.deleteBooking();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking deleted successfully.",
    data: null,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
