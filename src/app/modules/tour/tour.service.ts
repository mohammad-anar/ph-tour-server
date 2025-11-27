/* eslint-disable @typescript-eslint/no-dynamic-delete */
import httpstatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { tourSearchableFields } from "./tour.constants";
import { ITour, ITourType } from "./tour.interfaces";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new AppError(
      httpstatus.BAD_REQUEST,
      "A tour with this title already exist!!!"
    );
  }

  //   create tour
  const tour = await Tour.create(payload);
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
const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder<ITour>(Tour.find(), query);

  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta]: any = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

// update tour
const updateTour = async (id: string, payload: ITour) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(
      httpstatus.BAD_REQUEST,
      "The tour with this id does not exist!!"
    );
  }

  // check already have images or not in the tour
  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...existingTour.images, ...payload.images];
  }

  //

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images?.filter(
      (image) => !payload.deleteImages?.includes(image)
    );
    const updatedPayloadImages = (payload.images || [])
      .filter((image) => !payload.deleteImages?.includes(image))
      .filter((image) => !restDBImages.includes(image));
    payload.images = [...restDBImages, ...updatedPayloadImages];
  }
  //   create tour
  const tour = await Tour.findByIdAndUpdate(id, payload, { new: true });

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload?.deleteImages?.map((url) => deleteImageFromCloudinary(url))
    );
  }
  //
  return tour;
};

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne(payload);

  if (existingTourType) {
    throw new Error("Tour type already exists.");
  }

  return await TourType.create(payload);
};

export const tourService = {
  createTour,
  getAllTours,
  createTourType,
  updateTour,
};
