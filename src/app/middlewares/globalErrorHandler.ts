/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { error } from "console";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }
  let statusCode = 500;
  let message = `Something went wrong!!`;
  const errorSources: any = [
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

    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
  }
  // zod error
  else if (err.name === "ZodError") {
    message = "Zod error!";
    statusCode = 400;
    console.log(err.issues);
    err.issues.forEach((issue: any) => {
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      });
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
