"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourService = void 0;
/* eslint-disable @typescript-eslint/no-dynamic-delete */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_constants_1 = require("./tour.constants");
const tour_model_1 = require("./tour.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createTour = async (payload) => {
    const existingTour = await tour_model_1.Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A tour with this title already exist!!!");
    }
    //   create tour
    const tour = await tour_model_1.Tour.create(payload);
    return tour;
};
// old get all tours
// const oldGetAllTours = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;
//   // delete filter["searchTerm"];
//   // delete filter["sort"];
//   for (const field of excludeField) {
//     delete filter[field];
//   }
//   // const tourSearchableFields: string[] = ["title", "description", "location"];
//   //   const queryBuilder = new QueryBuilder(Tour.find(), query);
//   //   const tours = await queryBuilder
//   //     .search(tourSearchableFields)
//   //     .filter()
//   //     .sort()
//   //     .paginate();
//   //   // const meta = await queryBuilder.getMeta();
//   //   const [data, meta] = await Promise.all([
//   //     tours.build(),
//   //     queryBuilder.getMeta(),
//   //   ]);
//   // const tours = await Tour.find({
//   //   // title: { $regex: serachTerm, $options: "i" },
//   //   // $or: [
//   //   //   { title: { $regex: serachTerm, $options: "i" } },
//   //   //   { description: { $regex: serachTerm, $options: "i" } },
//   //   //   { location: { $regex: serachTerm, $options: "i" } },
//   //   // ],
//   //   $or: searchArray,
//   // });
//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };
//   const tours = await Tour.find(searchQuery)
//     .find(filter)
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);
//   const totalDocument = await Tour.countDocuments();
//   const meta = {
//     page: page,
//     limit: limit,
//     totalPage: Math.ceil(totalDocument / limit),
//     total: totalDocument,
//   };
//   return { data: tours, meta: meta };
// };
// get all tours
const getAllTours = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = await queryBuilder
        .filter()
        .search(tour_constants_1.tourSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
};
// update tour
const updateTour = async (id, payload) => {
    const existingTour = await tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "The tour with this id does not exist!!");
    }
    // check already have images or not in the tour
    if (payload.images &&
        payload.images.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        payload.images = [...existingTour.images, ...payload.images];
    }
    //
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        const restDBImages = existingTour.images?.filter((image) => !payload.deleteImages?.includes(image));
        const updatedPayloadImages = (payload.images || [])
            .filter((image) => !payload.deleteImages?.includes(image))
            .filter((image) => !restDBImages.includes(image));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    //   create tour
    const tour = await tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deleteImages &&
        payload.deleteImages.length > 0 &&
        existingTour.images &&
        existingTour.images.length > 0) {
        await Promise.all(payload?.deleteImages?.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    //
    return tour;
};
const createTourType = async (payload) => {
    const existingTourType = await tour_model_1.TourType.findOne(payload);
    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }
    return await tour_model_1.TourType.create(payload);
};
exports.tourService = {
    createTour,
    getAllTours,
    createTourType,
    updateTour,
};
//# sourceMappingURL=tour.service.js.map