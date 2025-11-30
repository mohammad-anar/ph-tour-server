"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const division_service_1 = require("./division.service");
const createDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        thumbnail: req?.file?.path,
    };
    const result = await division_service_1.DivisionService.createDivision(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Division created successfully!",
        data: result,
    });
});
const getAllDivisions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await division_service_1.DivisionService.getAllDivisions();
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "All division retrieve successfully!",
        data: result,
    });
});
const getSingleDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const slug = req.params.slug;
    const result = await division_service_1.DivisionService.getSingleDivision(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Division retrive successfully.",
        data: result,
    });
});
const updateDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const payload = {
        ...req.body,
        thumbnail: req?.file?.path,
    };
    const result = await division_service_1.DivisionService.updateDivision(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "All division retrieve successfully!",
        data: result,
    });
});
const deleteDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await division_service_1.DivisionService.deleteDivision(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "All division retrieve successfully!",
        data: result,
    });
});
exports.DivisionController = {
    createDivision,
    updateDivision,
    deleteDivision,
    getAllDivisions,
    getSingleDivision,
};
//# sourceMappingURL=division.controller.js.map