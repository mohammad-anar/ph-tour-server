import { Request, Response } from "express";
import httpstatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { IUser } from "./user.interfaces";
import { JwtPayload } from "jsonwebtoken";

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
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;

  // const token = req.headers.authorization;

  // // verify token assert form checkAuth
  const verifiedToken = req.user;

  // update user
  const user = await UserServices.updateUser(
    userId as string,
    payload,
    verifiedToken as IUser
  );
  // res.status(httpstatus.CREATED).json({
  //   success: true,
  //   message: "User created successfully",
  //   data: user,
  // });
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "User updated successfully!!",
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
    message: "All users retrieve successfully!!",
    data: data?.data,
    meta: data?.meta,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const data = await UserServices.getMe(user?.userId);
  // res.status(httpstatus.OK).json({
  //   success: true,
  //   message: "All user retrive successfully",
  //   data: users,
  // });
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Your profile retrieve successfully!!",
    data: data?.data,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
};

// app - route middleware match
// router - controller mathc
// controller - service
// service - model - database interaction
