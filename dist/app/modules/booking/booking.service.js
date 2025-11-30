"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createBooking = async (payload, userId) => {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = await booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user?.phone || !user?.address) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please Update your profile to Book a Tour");
        }
        // getting tour
        const tour = await tour_model_1.Tour.findById(payload.tour).select("costFrom");
        console.log(user, tour, "hdisfdi");
        const amount = Number(tour?.costFrom) * Number(payload.guestCount);
        if (!tour?.costFrom) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No tour cost found!!");
        }
        // creating booking
        const booking = await booking_model_1.Booking.create([
            {
                ...payload,
                status: booking_interface_1.BOOKING_STATUS.PENDING,
                user: userId,
            },
        ], { session });
        const payment = await payment_model_1.Payment.create([
            {
                booking: booking[0]?._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount,
            },
        ], { session });
        const updatedBooking = await booking_model_1.Booking.findByIdAndUpdate(booking[0]?._id, {
            payment: payment[0]?._id,
        }, { new: true, runValidators: true, session })
            .populate("user", "-password")
            .populate("tour", "title costFrom ")
            .populate("payment");
        const userAddress = updatedBooking?.user?.address;
        const userPhone = updatedBooking?.user?.phone;
        const sslPayload = {
            address: userAddress,
            email: user.email,
            phone: userPhone,
            amount: amount,
            transactionId: transactionId,
            name: user.name,
        };
        const sslPayment = await sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        console.log({ sslPayment });
        await session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking,
        };
        //
    }
    catch (error) {
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
exports.BookingService = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
//# sourceMappingURL=booking.service.js.map