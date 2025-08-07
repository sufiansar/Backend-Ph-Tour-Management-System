"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourTypeZodSchema = exports.UpdateTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
exports.createTourZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be under 100 characters" }),
    slug: zod_1.z
        .string({ required_error: "Slug is required" })
        .min(3, { message: "Slug must be at least 3 characters" })
        .optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z.number().optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivelLocation: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    included: zod_1.z.array(zod_1.z.string({ required_error: "Included item must be a string" }), {
        required_error: "Included items are required",
    }),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    deleteImages: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number().int().positive().optional(),
    minAge: zod_1.z
        .number({ required_error: "Minimum age is required" })
        .int()
        .min(0, { message: "Minimum age must be a non-negative number" }),
    division: zod_1.z
        .string({ required_error: "Division ID is required" })
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId for dicvision",
    }),
    tourType: zod_1.z
        .string({ required_error: "Tour type ID is required" })
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId for tourType",
    }),
});
exports.UpdateTourZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(100, { message: "Title must be under 100 characters" })
        .optional(),
    slug: zod_1.z
        .string({ required_error: "Slug is required" })
        .min(3, { message: "Slug must be at least 3 characters" })
        .optional(),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    costFrom: zod_1.z
        .string()
        .regex(/^\d+$/, { message: "Cost must be a numeric string" })
        .optional(),
    departureLocation: zod_1.z.string().optional(),
    arrivelLocation: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    included: zod_1.z.array(zod_1.z.string({ required_error: "Included item must be a string" }), {
        required_error: "Included items are required",
    }),
    excluded: zod_1.z.array(zod_1.z.string()).optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional(),
    tourPlan: zod_1.z.array(zod_1.z.string()).optional(),
    maxGuest: zod_1.z.number().int().positive().optional(),
    minAge: zod_1.z
        .number({ required_error: "Minimum age is required" })
        .int()
        .min(0, { message: "Minimum age must be a non-negative number" }),
    dicvision: zod_1.z
        .string({ required_error: "Division ID is required" })
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId for dicvision",
    }),
    tourType: zod_1.z
        .string({ required_error: "Tour type ID is required" })
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId for tourType",
    }),
});
exports.createTourTypeZodSchema = zod_1.z.object({
    name: zod_1.z.string(),
});
