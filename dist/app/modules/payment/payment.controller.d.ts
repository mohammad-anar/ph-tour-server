import { Request, Response } from "express";
export declare const PaymentController: {
    makePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    successPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    failedPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    canceledPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getInvoiceUrl: (req: Request, res: Response, next: import("express").NextFunction) => void;
    validatePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=payment.controller.d.ts.map