import AppError from "../../errorHelpers/AppError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { IUser } from "../user/user.interfaces";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

const makePayment = async (bookingId: string) => {
  console.log({ bookingId });

  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No payment found for this Booking!!"
    );
  }

  const booking = await Booking.findById(bookingId);

  const userAddress = (booking?.user as Partial<IUser>)?.address;
  const userPhone = (booking?.user as Partial<IUser>)?.phone;
  const userEmail = (booking?.user as Partial<IUser>)?.email;
  const userName = (booking?.user as Partial<IUser>)?.name;

  const sslPayload: ISSLCommerz = {
    address: userAddress as string,
    email: userEmail as string,
    phone: userPhone as string,
    amount: payment.amount,
    transactionId: payment.transactionId as string,
    name: userName as string,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  // update booking status confirm
  // update payment status to PAID

  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, session }
    );

    // update booking
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETED,
      },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment completed successfully" };
  } catch (error) {
    console.log(error);
  }
};
const failedPayment = async (query: Record<string, string>) => {
  // update booking status failed
  // update payment status to failed
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, session }
    );

    // update booking
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.FAILED,
      },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment failded." };
  } catch (error) {
    console.log(error);
  }
};
const canceledPayment = async (query: Record<string, string>) => {
  // update booking status canceled
  // update payment status to canceled
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELED },
      { new: true, session }
    );

    // update booking
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.CANCELED,
      },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Canceled" };
  } catch (error) {
    console.log(error);
  }
};

export const PaymentService = {
  makePayment,
  successPayment,
  failedPayment,
  canceledPayment,
};
