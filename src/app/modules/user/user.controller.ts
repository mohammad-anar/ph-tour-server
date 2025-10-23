import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status-codes";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new AppError(httpstatus.BAD_REQUEST, "Something went wrong!!!");

    const user = await UserServices.createUser(req.body);

    res.status(httpstatus.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const UserControllers = {
  createUser,
};

// app - route middleware match
// router - controller mathc
// controller - service
// service - model - database interaction
