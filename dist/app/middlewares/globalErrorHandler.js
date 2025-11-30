"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = async (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    // cloudinary fle delete
    if (req.file) {
        await (0, cloudinary_config_1.deleteImageFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map((file) => file.path);
        await Promise.all(imageUrls.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    // cloudinary file deleted
    let statusCode = 500;
    let message = `Something went wrong!!`;
    const errorSources = [
    // {
    //   path: "",
    //   message: "",
    // },
    ];
    // third party error from
    /**
     * mongoose
     * zod
     * */
    /**
     * mongoose
     * --> duplicate error
     *
     * --> cast error
     *
     * zod
     * -->
     *
     *
     **/
    // duplicate error
    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/);
        statusCode = 400;
        message = `${matchedArray[1]} already exist`;
    }
    // mongoose cast error
    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid MongoDB ObjectID. Please provide a valid id.`;
    }
    // mongoose valication error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error Occourd.";
        const errors = Object.values(err?.errors);
        errors.forEach((errorObject) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message,
        }));
    }
    // zod error
    else if (err.name === "ZodError") {
        message = "Zod error!";
        statusCode = 400;
        console.log(err.issues);
        err.issues.forEach((issue) => {
            errorSources.push({
                path: issue.path[issue.path.length - 1],
                message: issue.message,
            });
        });
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map