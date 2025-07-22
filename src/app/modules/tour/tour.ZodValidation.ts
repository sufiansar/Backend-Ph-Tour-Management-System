import { z } from "zod";
import { Types } from "mongoose";

export const createTourZodSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be under 100 characters" }),

  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, { message: "Slug must be at least 3 characters" })
    .optional(),

  description: z.string().optional(),

  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),

  location: z.string().optional(),

  costFrom: z.number().optional(),

  departureLocation: z.string().optional(),
  arrivelLocation: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  included: z.array(
    z.string({ required_error: "Included item must be a string" }),
    {
      required_error: "Included items are required",
    }
  ),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z.number().int().positive().optional(),

  minAge: z
    .number({ required_error: "Minimum age is required" })
    .int()
    .min(0, { message: "Minimum age must be a non-negative number" }),

  dicvision: z
    .string({ required_error: "Division ID is required" })
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId for dicvision",
    }),

  tourType: z
    .string({ required_error: "Tour type ID is required" })
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId for tourType",
    }),
});

export const UpdateTourZodSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be under 100 characters" })
    .optional(),

  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, { message: "Slug must be at least 3 characters" })
    .optional(),

  description: z.string().optional(),

  images: z
    .array(z.string().url({ message: "Each image must be a valid URL" }))
    .optional(),

  location: z.string().optional(),

  costFrom: z
    .string()
    .regex(/^\d+$/, { message: "Cost must be a numeric string" })
    .optional(),
  departureLocation: z.string().optional(),
  arrivelLocation: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  included: z.array(
    z.string({ required_error: "Included item must be a string" }),
    {
      required_error: "Included items are required",
    }
  ),

  excluded: z.array(z.string()).optional(),

  amenities: z.array(z.string()).optional(),

  tourPlan: z.array(z.string()).optional(),

  maxGuest: z.number().int().positive().optional(),

  minAge: z
    .number({ required_error: "Minimum age is required" })
    .int()
    .min(0, { message: "Minimum age must be a non-negative number" }),

  dicvision: z
    .string({ required_error: "Division ID is required" })
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId for dicvision",
    }),

  tourType: z
    .string({ required_error: "Tour type ID is required" })
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId for tourType",
    }),
});

export const createTourTypeZodSchema = z.object({
  name: z.string(),
});
