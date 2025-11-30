import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod/v3";
export declare const validateRequest: (zodSchema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validateRequest.d.ts.map