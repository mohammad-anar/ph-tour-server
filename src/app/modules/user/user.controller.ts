import { Request, Response } from "express";
import httpstatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";

// create users
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new AppError(httpstatus.BAD_REQUEST, "Something went wrong!!!");

//     const user = await UserServices.createUser(req.body);

//     res.status(httpstatus.CREATED).json({
//       message: "User created successfully",
//       data: user,
//     });
//   } catch (error: any) {
//     console.log(error);
//     next(error);
//   }
// };
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);
  // res.status(httpstatus.CREATED).json({
  //   success: true,
  //   message: "User created successfully",
  //   data: user,
  // });
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const data = await UserServices.getAllUsers();
  // res.status(httpstatus.OK).json({
  //   success: true,
  //   message: "All user retrive successfully",
  //   data: users,
  // });
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "User retrive successfully!!",
    data: data?.data,
    meta: data?.meta,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};

// app - route middleware match
// router - controller mathc
// controller - service
// service - model - database interaction
