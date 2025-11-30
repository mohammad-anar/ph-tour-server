"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = async (payload) => {
    // create slug
    // const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
    // let slug = `${baseSlug}-division`;
    // let counter = 0;
    // while (await Division.exists({ slug })) {
    //   slug = `${slug}-${counter++}`;
    // }
    // payload.slug = slug;
    // check duplicate
    const isExistDivision = await division_model_1.Division.findOne({ name: payload.name });
    //   throw error if exist
    if (isExistDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A division with this name already exist");
    }
    const division = await division_model_1.Division.create(payload);
    return division;
};
// get divisions
const getAllDivisions = async () => {
    const divisions = await division_model_1.Division.find({});
    const totalDivision = await division_model_1.Division.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivision,
        },
    };
};
const getSingleDivision = async (slug) => {
    const division = await division_model_1.Division.findOne({ slug });
    return {
        data: division,
    };
};
// update divisions
const updateDivision = async (id, payload) => {
    // check duplicate
    const isExistDivision = await division_model_1.Division.findById(id);
    //   throw error if exist
    if (!isExistDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This division does not exist!");
    }
    const duplicateDivision = await division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (duplicateDivision) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "A division with this name already exist.");
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
    const updatedDivision = await division_model_1.Division.findByIdAndUpdate(id, payload, {
        new: true,
        reValidators: true,
    });
    if (payload.thumbnail && isExistDivision.thumbnail) {
        await (0, cloudinary_config_1.deleteImageFromCloudinary)(isExistDivision.thumbnail);
    }
    return updatedDivision;
};
const deleteDivision = async (id) => {
    // check duplicate
    await division_model_1.Division.findByIdAndDelete(id);
    return null;
};
exports.DivisionService = {
    createDivision,
    updateDivision,
    getAllDivisions,
    getSingleDivision,
    deleteDivision,
};
//# sourceMappingURL=division.service.js.map