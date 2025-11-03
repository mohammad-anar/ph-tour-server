import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod/v3";
export const validateRequest =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body, "old body");
      req.body = await zodSchema.parseAsync(req.body);
      console.log(req.body, "new body");
      next();
    } catch (error) {
      next(error);
    }
  };
