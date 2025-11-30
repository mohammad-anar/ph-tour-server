"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    console.log({ decodedToken });
    const booking = await booking_service_1.BookingService.createBooking(req.body, decodedToken.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Booking created successfully.",
        data: booking,
    });
});
const getAllBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await booking_service_1.BookingService.getAllBookings();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Bookings retrieve successfully.",
        data: bookings,
    });
});
const getUserBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await booking_service_1.BookingService.getUserBookings();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Bookings retrieve successfully.",
        data: bookings,
    });
});
const getSingleBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const booking = await booking_service_1.BookingService.getSingleBooking();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Booking retrieve successfully.",
        data: booking,
    });
});
const updateBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const booking = await booking_service_1.BookingService.updateBooking();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Booking updated successfully.",
        data: booking,
    });
});
const deleteBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await booking_service_1.BookingService.deleteBooking();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Booking deleted successfully.",
        data: null,
    });
});
exports.BookingController = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
//# sourceMappingURL=booking.controller.js.map