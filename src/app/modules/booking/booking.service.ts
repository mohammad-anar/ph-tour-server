import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import httpStatus from "http-status-codes";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Update your profile to Book a Tour"
      );
    }

    // getting tour
    const tour = await Tour.findById(payload.tour).select("costFrom");

    console.log(user, tour, "hdisfdi");

    const amount = Number(tour?.costFrom) * Number(payload.guestCount);

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found!!");
    }

    // creating booking
    const booking = await Booking.create(
      [
        {
          ...payload,
          status: BOOKING_STATUS.PENDING,
          user: userId,
        },
      ],
      { session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]?._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]?._id,
      {
        payment: payment[0]?._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "-password")
      .populate("tour", "title costFrom ")
      .populate("payment");

    const userAddress = (updatedBooking?.user as Partial<IUser>)?.address;
    const userPhone = (updatedBooking?.user as Partial<IUser>)?.phone;

    const sslPayload: ISSLCommerz = {
      address: userAddress as string,
      email: user.email,
      phone: userPhone as string,
      amount: amount,
      transactionId: transactionId as string,
      name: user.name,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    console.log({ sslPayment });

    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
    //
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getAllBookings = async () => {
  return {};
};
const getUserBookings = async () => {
  return {};
};
const getSingleBooking = async () => {
  return {};
};
const updateBooking = async () => {
  return {};
};
const deleteBooking = async () => {
  return {};
};

export const BookingService = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
