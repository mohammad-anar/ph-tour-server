import httpstatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constants";
import { ITour, ITourType } from "./tour.interfaces";
import { Tour, TourType } from "./tour.model";

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

const updateTour = async (id: string, payload: ITour) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(
      httpstatus.BAD_REQUEST,
      "The tour with this id does not exist!!"
    );
  }

  //   create tour
  const tour = await Tour.findByIdAndUpdate(id, payload, { new: true });
  return tour;
};
const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .paginate();

  // const meta = await queryBuilder.getMeta();
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
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
