import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IsActive, Role } from "../modules/user/user.interfaces";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "No token received. Login first.");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExist = await User.findOne({
        email: verifiedToken.email,
      });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist.");
      }

      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is not verified`);
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is deleted`);
      }

      // check auths
      if (!authRoles.includes(verifiedToken.role))
        if (
          (verifiedToken as JwtPayload).role !== Role.ADMIN ||
          (verifiedToken as JwtPayload).role !== Role.SUPER_ADMIN
        ) {
          throw new AppError(403, "You are not permitted to view users!");
        }

      req.user = verifiedToken;
      // next function
      next();
    } catch (error) {
      console.log("jwt error", error);

      next(error);
    }
  };
