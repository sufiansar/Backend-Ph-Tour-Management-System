import { z } from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ required_error: "Division name is required" })
    .min(2, { message: "Division name must be at least 2 characters" })
    .max(100, { message: "Division name must be under 100 characters" }),

  slug: z
    .string({ required_error: "Slug is required" })
    .min(2, { message: "Slug must be at least 2 characters" })
    .optional(),

  thumbnail: z
    .string()
    .url({ message: "Thumbnail must be a valid URL" })
    .optional(),

  description: z.string().optional(),
});

export const UpdateDivisionZodeSchema = z.object({
  name: z
    .string({ required_error: "Division name is required" })
    .min(2, { message: "Division name must be at least 2 characters" })
    .max(100, { message: "Division name must be under 100 characters" })
    .optional(),

  slug: z
    .string({ required_error: "Slug is required" })
    .min(2, { message: "Slug must be at least 2 characters" })
    .optional(),

  thumbnail: z
    .string()
    .url({ message: "Thumbnail must be a valid URL" })
    .optional(),

  description: z.string().optional(),
});
