"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interfaces_1 = require("../user/user.interfaces");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = async () => {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interfaces_1.IsActive.ACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interfaces_1.IsActive.BLOCKED,
    });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interfaces_1.IsActive.BLOCKED,
    });
    const newUsersLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        // stage 1 grouping users by role and total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalBlockedUsers, totalInactiveUsers, newUserLast7Days, newUsersLast30Days, usersByRole,] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalBlockedUsersPromise,
        totalInActiveUsersPromise,
        newUsersLast7DaysPromise,
        newUsersLast30DaysPromise,
        usersByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
        totalInactiveUsers,
        newUserLast7Days,
        newUsersLast30Days,
        usersByRole,
    };
};
const getTourStats = async () => {
    const totalTourPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
        // stage 1: connect tour type model lookup stage
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type",
            },
        },
        // state 2 unwind the array to object
        {
            $unwind: "$type",
        },
        // stage 3 grouping tour type
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        // stage 1: group cost from, do sum and avg the sum
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalTourByDivisionPromise = tour_model_1.Tour.aggregate([
        // stage 1: connect division model lookup stage
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division",
            },
        },
        // state 2 unwind the array to object
        {
            $unwind: "$division",
        },
        // stage 3 grouping tour type
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 },
            },
        },
    ]);
    const heightBookedTourPromise = booking_model_1.Booking.aggregate([
        // stage-1: group the tour
        {
            $group: { _id: "$tour", bookingCount: { $sum: 1 } },
        },
        // stage-2: sort the tour
        {
            $sort: { bookingCount: -1 },
        },
        // stage -3: limit
        {
            $limit: 5,
        },
        // stage-4
        {
            $lookup: {
                from: "tours",
                // localField: "tour",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] },
                        },
                    },
                ],
                as: "tour",
            },
        },
        // stage 5: unwind stage
        {
            $unwind: "$tour",
        },
        // stage 6: project stage
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, heightBookedTour,] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        heightBookedTourPromise,
    ]);
    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
        totalTourByDivision,
        heightBookedTour,
    };
};
const getBookingStats = async () => {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        // stage-1: grouping stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingPerTourPromise = booking_model_1.Booking.aggregate([
        // group by tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 },
            },
        },
        // stage 2
        {
            $sort: { bookingCount: -1 },
        },
        // stage 3
        {
            $limit: 10,
        },
        // stage 4
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour",
            },
        },
        // stage 5
        {
            $unwind: "$tour",
        },
        // stage 6
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1,
            },
        },
    ]);
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        // state 1: grouping
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingInLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingInLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalUniqueUserPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking, bookingInLast7Days, bookingInLast30Days, totalUniqueUser,] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingInLast7DaysPromise,
        bookingInLast30DaysPromise,
        totalUniqueUserPromise,
    ]);
    return {
        totalBooking,
        totalBookingByStatus,
        bookingPerTour,
        avgGuestCountPerBooking,
        bookingInLast7Days,
        bookingInLast30Days,
        totalUniqueUser,
    };
};
const getPaymentStats = async () => {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentsByStatusPromise = payment_model_1.Payment.aggregate([
        // stage 1
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        // stage 1
        {
            $match: { status: payment_interface_1.PAYMENT_STATUS.PAID },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
            },
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPayment: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentsByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData,] = await Promise.all([
        totalPaymentPromise,
        totalPaymentsByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise,
    ]);
    return {
        totalPayment,
        totalPaymentsByStatus,
        totalRevenue,
        avgPaymentAmount,
        paymentGatewayData,
    };
};
exports.StatsService = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};
//# sourceMappingURL=stats.service.js.map