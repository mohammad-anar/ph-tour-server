"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const payment_invoice_1 = require("../../utils/pdf/payment.invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const makePayment = async (bookingId) => {
    console.log({ bookingId });
    const payment = await payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No payment found for this Booking!!");
    }
    const booking = await booking_model_1.Booking.findById(bookingId);
    const userAddress = booking?.user?.address;
    const userPhone = booking?.user?.phone;
    const userEmail = booking?.user?.email;
    const userName = booking?.user?.name;
    const sslPayload = {
        address: userAddress,
        email: userEmail,
        phone: userPhone,
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: userName,
    };
    const sslPayment = await sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    return {
        paymentUrl: sslPayment.GatewayPageURL,
    };
};
const successPayment = async (query) => {
    // update booking status confirm
    // update payment status to PAID
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, session });
        // update booking
        const updatedBooking = await booking_model_1.Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: booking_interface_1.BOOKING_STATUS.COMPLETED,
        }, { new: true, runValidators: true, session })
            .populate("tour", "title")
            .populate("user", "name email");
        const invoiceData = {
            bookingDate: updatedBooking?.createdAt,
            guestCount: updatedBooking?.guestCount,
            totalAmount: updatedPayment?.amount,
            tourTitle: (updatedBooking?.tour).title,
            transactionId: updatedPayment?.transactionId,
            userName: (updatedBooking?.user).name,
        };
        const pdfBuffer = await (0, payment_invoice_1.generatePDF)(invoiceData);
        const cloudinaryResult = await (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        await payment_model_1.Payment.findByIdAndUpdate(updatedPayment?._id, {
            invoiceUrl: cloudinaryResult?.secure_url,
        }, { runValidators: true, session });
        await (0, sendEmail_1.sendEmail)({
            to: (updatedBooking?.user).email,
            subject: "Your Booking invoice.",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    fileName: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment completed successfully" };
    }
    catch (error) {
        console.log(error);
    }
};
const failedPayment = async (query) => {
    // update booking status failed
    // update payment status to failed
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { new: true, session });
        // update booking
        await booking_model_1.Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: booking_interface_1.BOOKING_STATUS.FAILED,
        }, { runValidators: true, session });
        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment failded." };
    }
    catch (error) {
        console.log(error);
    }
};
const canceledPayment = async (query) => {
    // update booking status canceled
    // update payment status to canceled
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELED }, { new: true, session });
        // update booking
        await booking_model_1.Booking.findByIdAndUpdate(updatedPayment?.booking, {
            status: booking_interface_1.BOOKING_STATUS.CANCELED,
        }, { runValidators: true, session });
        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Canceled" };
    }
    catch (error) {
        console.log(error);
    }
};
const getInvoiceUrl = async (paymentId) => {
    try {
        const payment = await payment_model_1.Payment.findById(paymentId).select("invoiceUrl");
        if (!payment) {
            throw new AppError_1.default(401, "Payment not found");
        }
        if (!payment.invoiceUrl) {
            throw new AppError_1.default(401, "No invoiceUrl found");
        }
        return payment.invoiceUrl;
    }
    catch (error) {
        console.log(error);
    }
};
exports.PaymentService = {
    makePayment,
    successPayment,
    failedPayment,
    canceledPayment,
    getInvoiceUrl,
};
//# sourceMappingURL=payment.service.js.map