import { Booking } from "../Booking/booking.model";
import { PAYMENT_STATUS } from "../Payment/payment.interface";
import { Payment } from "../Payment/payment.model";
import { Tour } from "../tour/tour.model";
import { Isactive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date().setDate(now.getDate() - 7);
const fourteenDaysAgo = new Date().setDate(now.getDate() - 14);
const thirtyDaysAgo = new Date().setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    isActive: Isactive.ACTIVE,
  });
  const totalInactiveUsersPromise = User.countDocuments({
    isActive: Isactive.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    isActive: Isactive.BLOCKED,
  });

  const sevenDaysAgoCountPromise = User.countDocuments({
    createdAt: { $gte: new Date(sevenDaysAgo) },
  });
  const fourteenDaysAgoCountPromise = User.countDocuments({
    createdAt: { $gte: new Date(fourteenDaysAgo) },
  });
  const thirtyDaysAgoCountPromise = User.countDocuments({
    createdAt: { $gte: new Date(thirtyDaysAgo) },
  });

  const usersByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$Role",
        count: { $sum: 1 },
      },
    },
  ]);
  const [
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    sevenDaysAgoCount,
    fourteenDaysAgoCount,
    thirtyDaysAgoCount,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    sevenDaysAgoCountPromise,
    fourteenDaysAgoCountPromise,
    thirtyDaysAgoCountPromise,
    usersByRolePromise,
  ]);
  return {
    totalUsers,
    totalActiveUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsers: {
      sevenDaysAgo: sevenDaysAgoCount,
      fourteenDaysAgo: fourteenDaysAgoCount,
      thirtyDaysAgo: thirtyDaysAgoCount,
    },
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalToursPromise = Tour.countDocuments();

  const totalTourByTourTypePromise = Tour.aggregate([
    {
      $lookup: {
        from: "tourtypes",
        localField: "tourType",
        foreignField: "_id",
        as: "type",
      },
    },
    {
      $unwind: "$type",
    },
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const tourCostPromise = Tour.aggregate([
    {
      $group: {
        _id: null,
        minCost: { $min: "$costFrom" },
        maxCost: { $max: "$costFrom" },
        avgCost: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalTourByTourDivisionPromise = Tour.aggregate([
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },
    {
      $unwind: "$division",
    },
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalHigestTourBookedPromise = Booking.aggregate([
    {
      $group: {
        _id: "$tour",
        totalBookings: { $sum: 1 },
      },
    },
    {
      $sort: { totalBookings: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$_id", "$$tourId"] } },
          },
        ],
        as: "tour",
      },
    },
    {
      $unwind: {
        path: "$tour",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $project: {
        title: "$tour.title",
        slug: "$tour.slug",
        totalBookings: 1,
      },
    },
  ]);

  const [
    totalTours,
    totalTourByTourType,
    tourCost,
    totalHigestTourBooked,
    totalTourByTourDivision,
  ] = await Promise.all([
    totalToursPromise,
    totalTourByTourTypePromise,
    tourCostPromise,
    totalTourByTourDivisionPromise,
    totalHigestTourBookedPromise,
  ]);

  return {
    totalTours,
    totalTourByTourType,
    tourCost,
    totalHigestTourBooked,
    totalTourByTourDivision,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    //stage-1 group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsPerTourPromise = Booking.aggregate([
    //stage1 group stage

    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    //stage-2 sort stage
    {
      $sort: { bookingCount: -1 },
    },

    //stage-3 limit stage
    {
      $limit: 10,
    },

    //stage-4 lookup stage
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },

    // stage5 - unwind stage
    {
      $unwind: "$tour",
    },

    // stage6 project stage

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
    // stage 1  - group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingsLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingsLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingByUniqueUsersPromise = Booking.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingsPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingsLast7DaysPromise,
    bookingsLast30DaysPromise,
    totalBookingByStatusPromise,
    totalBookingByUniqueUsersPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  };
};
const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentByStatusPromise = Payment.aggregate([
    //stage 1 group
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    //stage1 match stage
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
    //stage 1 group stage
    {
      $group: {
        _id: null,
        avgPaymentAMount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    //stage 1 group stage
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);
  return {
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  };
};

export const StatsService = {
  getUserStats,
  getBookingStats,
  getTourStats,
  getPaymentStats,
};
