import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import sendResponse from "../../utils/sendResponse";

const makePayment = catchAsync(async (req: Request, res: Response) => {
  //
  const bookingId = req.params.bookingId;

  const result = await PaymentService.makePayment(bookingId as string);

  console.log({ result });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment done successfully",
    data: result,
  });
});
const successPayment = catchAsync(async (req: Request, res: Response) => {
  //
  const query = req.query;
  const result = await PaymentService.successPayment(
    query as Record<string, string>
  );

  if (result?.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`
    );
  }
});
const failedPayment = catchAsync(async (req: Request, res: Response) => {
  //
  const query = req.query;
  const result = await PaymentService.failedPayment(
    query as Record<string, string>
  );

  if (!result?.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAILED_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`
    );
  }
});
const canceledPayment = catchAsync(async (req: Request, res: Response) => {
  //
  const query = req.query;
  const result = await PaymentService.canceledPayment(
    query as Record<string, string>
  );

  if (!result?.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`
    );
  }
});

export const PaymentController = {
  makePayment,
  successPayment,
  failedPayment,
  canceledPayment,
};
