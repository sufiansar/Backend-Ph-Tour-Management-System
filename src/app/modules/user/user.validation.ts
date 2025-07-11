import z, { object } from "zod";
import { Isactive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be under 50 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please provide a valid email address" }),

  password: z
    .string({ required_error: "Password is required" })
    .regex(/^.{8,20}$/, {
      message: "Password must be between 8 and 20 characters",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character (@$!%*?&)",
    }),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z
    .string({
      invalid_type_error: "Address must be a valid Bangladeshi region",
    })
    .optional(),

  Auth: z
    .array(z.string(), {
      required_error: "Auth providers are required",
    })
    .optional(),
});

export const UpdateUserZodSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be under 50 characters" }),

  password: z
    .string({ required_error: "Password is required" })
    .regex(/^.{8,20}$/, {
      message: "Password must be between 8 and 20 characters",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character (@$!%*?&)",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isactive: z.enum(Object.values(Isactive) as [string]).optional(),

  isdeleted: z.boolean({ required_error: "isdeleted must be true or false" }),

  isVerified: z.boolean({ required_error: "isVerified must be true or false" }),

  address: z
    .string({
      invalid_type_error: "Address must be a valid Bangladeshi region",
    })
    .optional(),

  Auth: z
    .array(z.string(), {
      required_error: "Auth providers are required",
    })
    .optional(),
});
