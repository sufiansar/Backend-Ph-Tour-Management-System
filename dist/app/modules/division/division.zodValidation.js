"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDivisionZodeSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = require("zod");
exports.createDivisionZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Division name is required" })
        .min(2, { message: "Division name must be at least 2 characters" })
        .max(100, { message: "Division name must be under 100 characters" }),
    slug: zod_1.z
        .string({ required_error: "Slug is required" })
        .min(2, { message: "Slug must be at least 2 characters" })
        .optional(),
    thumbnail: zod_1.z
        .string()
        .url({ message: "Thumbnail must be a valid URL" })
        .optional(),
    description: zod_1.z.string().optional(),
});
exports.UpdateDivisionZodeSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Division name is required" })
        .min(2, { message: "Division name must be at least 2 characters" })
        .max(100, { message: "Division name must be under 100 characters" })
        .optional(),
    slug: zod_1.z
        .string({ required_error: "Slug is required" })
        .min(2, { message: "Slug must be at least 2 characters" })
        .optional(),
    thumbnail: zod_1.z
        .string()
        .url({ message: "Thumbnail must be a valid URL" })
        .optional(),
    description: zod_1.z.string().optional(),
});
