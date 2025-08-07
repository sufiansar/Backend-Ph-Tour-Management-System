"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const booking_model_1 = require("../Booking/booking.model");
const payment_interface_1 = require("../Payment/payment.interface");
const payment_model_1 = require("../Payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date().setDate(now.getDate() - 7);
const fourteenDaysAgo = new Date().setDate(now.getDate() - 14);
const thirtyDaysAgo = new Date().setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.Isactive.ACTIVE,
    });
    const totalInactiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.Isactive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.Isactive.BLOCKED,
    });
    const sevenDaysAgoCountPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: new Date(sevenDaysAgo) },
    });
    const fourteenDaysAgoCountPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: new Date(fourteenDaysAgo) },
    });
    const thirtyDaysAgoCountPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: new Date(thirtyDaysAgo) },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$Role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInactiveUsers, totalBlockedUsers, sevenDaysAgoCount, fourteenDaysAgoCount, thirtyDaysAgoCount, usersByRole,] = yield Promise.all([
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
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalToursPromise = tour_model_1.Tour.countDocuments();
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
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
    const tourCostPromise = tour_model_1.Tour.aggregate([
        {
            $group: {
                _id: null,
                minCost: { $min: "$costFrom" },
                maxCost: { $max: "$costFrom" },
                avgCost: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalTourByTourDivisionPromise = tour_model_1.Tour.aggregate([
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
    const totalHigestTourBookedPromise = booking_model_1.Booking.aggregate([
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
    const [totalTours, totalTourByTourType, tourCost, totalHigestTourBooked, totalTourByTourDivision,] = yield Promise.all([
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
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingsPerTourPromise = booking_model_1.Booking.aggregate([
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
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        // stage 1  - group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingsLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingsLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
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
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        //stage1 match stage
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
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData,] = yield Promise.all([
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
});
exports.StatsService = {
    getUserStats,
    getBookingStats,
    getTourStats,
    getPaymentStats,
};
