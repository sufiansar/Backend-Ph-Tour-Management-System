"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must be under 50 characters" }),
    email: zod_1.default
        .string({ required_error: "Email is required" })
        .email({ message: "Please provide a valid email address" }),
    password: zod_1.default
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
    phone: zod_1.default
        .string()
        .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    address: zod_1.default
        .string({
        invalid_type_error: "Address must be a valid Bangladeshi region",
    })
        .optional(),
    Auth: zod_1.default
        .array(zod_1.default.string(), {
        required_error: "Auth providers are required",
    })
        .optional(),
});
exports.UpdateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ required_error: "Name is required" })
        .min(3, { message: "Name must be at least 3 characters" })
        .max(50, { message: "Name must be under 50 characters" })
        .optional(),
    password: zod_1.default
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
    phone: zod_1.default
        .string()
        .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isactive: zod_1.default.enum(Object.values(user_interface_1.Isactive)).optional(),
    isdeleted: zod_1.default
        .boolean({ required_error: "isdeleted must be true or false" })
        .optional(),
    isVerified: zod_1.default
        .boolean({ required_error: "isVerified must be true or false" })
        .optional(),
    address: zod_1.default
        .string({
        invalid_type_error: "Address must be a valid Bangladeshi region",
    })
        .optional(),
    Auth: zod_1.default
        .array(zod_1.default.string(), {
        required_error: "Auth providers are required",
    })
        .optional(),
});
