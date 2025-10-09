import { Request, Response } from "express";
import { User } from "./user.model";
import httpstatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });
    res.status(httpstatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(httpstatus.BAD_REQUEST).json({
      message: `Something went wrong!! ${error?.message}`,
      error,
    });
  }
};

export const UserControllers = {
  createUser,
};
