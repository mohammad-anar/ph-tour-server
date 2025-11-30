"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const tour_service_1 = require("./tour.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// create tour
const createTour = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        images: req.files?.map((file) => file?.path),
    };
    const result = await tour_service_1.tourService.createTour(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Tour created successfully",
        data: result,
    });
});
// update tour
const updateTour = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const payload = {
        ...req.body,
        images: req.files?.map((file) => file?.path),
    };
    if (!id) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Id does not provided.");
    }
    const result = await tour_service_1.tourService.updateTour(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Tour updated successfully",
        data: result,
    });
});
// get all tours
const getAllTours = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await tour_service_1.tourService.getAllTours(query);
    console.log(result, "see where result in tour get contorller");
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Tour retrieve successfully",
        data: result.data,
        meta: result.meta,
    });
});
const createTourType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name } = req.body;
    const result = await tour_service_1.tourService.createTourType({ name });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Tour type created successfully",
        data: result,
    });
});
exports.tourController = {
    createTour,
    getAllTours,
    createTourType,
    updateTour,
};
//# sourceMappingURL=tour.controller.js.map