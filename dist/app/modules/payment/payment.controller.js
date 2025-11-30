"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const payment_service_1 = require("./payment.service");
const env_1 = require("../../config/env");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const makePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    const bookingId = req.params.bookingId;
    const result = await payment_service_1.PaymentService.makePayment(bookingId);
    console.log({ result });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Payment done successfully",
        data: result,
    });
});
const successPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    const query = req.query;
    const result = await payment_service_1.PaymentService.successPayment(query);
    if (result?.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`);
    }
});
const failedPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    const query = req.query;
    const result = await payment_service_1.PaymentService.failedPayment(query);
    if (!result?.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAILED_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`);
    }
});
const canceledPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    const query = req.query;
    const result = await payment_service_1.PaymentService.canceledPayment(query);
    if (!result?.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query?.transactionId}&message=${result?.message}&amount=${query?.amount}&status=${query?.status}`);
    }
});
const getInvoiceUrl = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    const { paymentId } = req.params;
    const result = await payment_service_1.PaymentService.getInvoiceUrl(paymentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Invoice download URL retrieve successfully",
        data: result,
    });
});
const validatePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    //
    console.log("SSLCommerz IPN url body", req.body);
    await sslCommerz_service_1.SSLService.validatePayment(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "payment validated successfully",
        data: null,
    });
});
exports.PaymentController = {
    makePayment,
    successPayment,
    failedPayment,
    canceledPayment,
    getInvoiceUrl,
    validatePayment,
};
//# sourceMappingURL=payment.controller.js.map