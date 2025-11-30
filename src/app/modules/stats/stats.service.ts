import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive, IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    isActive: IsActive.BLOCKED,
  });

  const newUsersLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newUsersLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    // stage 1 grouping users by role and total users in each role

    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalBlockedUsers,
    totalInactiveUsers,
    newUserLast7Days,
    newUsersLast30Days,
    usersByRole,
  ] = await Promise.all([
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
  const totalTourPromise = Tour.countDocuments();
  const totalTourByTourTypePromise = Tour.aggregate([
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

  const avgTourCostPromise = Tour.aggregate([
    // stage 1: group cost from, do sum and avg the sum
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByDivisionPromise = Tour.aggregate([
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

  const heightBookedTourPromise = Booking.aggregate([
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

  const [
    totalTour,
    totalTourByTourType,
    avgTourCost,
    totalTourByDivision,
    heightBookedTour,
  ] = await Promise.all([
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
  const totalBookingPromise = Booking.countDocuments();
  const totalBookingByStatusPromise = Booking.aggregate([
    // stage-1: grouping stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
  const bookingPerTourPromise = Booking.aggregate([
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

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // state 1: grouping
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingInLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingInLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalUniqueUserPromise = Booking.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingPerTour,
    avgGuestCountPerBooking,
    bookingInLast7Days,
    bookingInLast30Days,
    totalUniqueUser,
  ] = await Promise.all([
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
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentsByStatusPromise = Payment.aggregate([
    // stage 1
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    // stage 1
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    {
      $group: {
        _id: null,
        avgPayment: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentsByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
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

export const StatsService = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
