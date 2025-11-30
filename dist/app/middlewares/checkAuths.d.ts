import { Request, Response, NextFunction } from "express";
export declare const checkAuth: (...authRoles: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=checkAuths.d.ts.map