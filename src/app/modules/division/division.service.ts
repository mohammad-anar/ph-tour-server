import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from "http-status-codes";

const createDivision = async (payload: IDivision) => {
  // create slug
  // const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
  // let slug = `${baseSlug}-division`;
  // let counter = 0;
  // while (await Division.exists({ slug })) {
  //   slug = `${slug}-${counter++}`;
  // }
  // payload.slug = slug;

  // check duplicate
  const isExistDivision = await Division.findOne({ name: payload.name });
  //   throw error if exist
  if (isExistDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A division with this name already exist"
    );
  }

  const division = await Division.create(payload);

  return division;
};

// get divisions
const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivision = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalDivision,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return {
    data: division,
  };
};

// update divisions
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  // check duplicate
  const isExistDivision = await Division.findById(id);
  //   throw error if exist
  if (!isExistDivision) {
    throw new AppError(httpStatus.BAD_REQUEST, "This division does not exist!");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "A division with this name already exist."
    );
  }

  // if (payload.name) {
  //   const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
  //   let slug = `${baseSlug}-division`;
  //   let counter = 0;
  //   while (await Division.exists({ slug })) {
  //     slug = `${slug}-${counter++}`;
  //   }
  //   payload.slug = slug;
  // }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    reValidators: true,
  });

  if (payload.thumbnail && isExistDivision.thumbnail) {
    await deleteImageFromCloudinary(isExistDivision.thumbnail);
  }

  return updatedDivision;
};
const deleteDivision = async (id: string) => {
  // check duplicate

  await Division.findByIdAndDelete(id);

  return null;
};

export const DivisionService = {
  createDivision,
  updateDivision,
  getAllDivisions,
  getSingleDivision,
  deleteDivision,
};
