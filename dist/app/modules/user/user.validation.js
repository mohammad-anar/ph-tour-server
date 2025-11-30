"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const user_interfaces_1 = require("./user.interfaces");
exports.createUserZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({ message: "Name must be string." })
        .min(2, { message: "Name must be 2 character long." })
        .max(100, { message: "Name must less than 100 character" }),
    email: v3_1.default
        .string({ message: "Email must be a string." })
        .email({ message: "Invalid email format." })
        .min(2, { message: "Email minimum 2 character long." })
        .max(100, { message: "Email maximum 100 character long." }),
    password: v3_1.default
        .string({ message: "Password must be a string." })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
        message: "Password must have at least one uppercase letter.",
    })
        .regex(/[a-z]/, {
        message: "Password must have at least one lowercase letter.",
    })
        .regex(/[0-9]/, { message: "Password must have at least one number." })
        .regex(/[!@#$%^&]/, {
        message: "Password must have at least one special character (!@#$%^&).",
    }),
    phone: v3_1.default
        .string({ message: "Phone number must be a string." })
        .regex(/^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/, {
        message: "Invalid Bangladeshi phone number.",
    })
        .optional(),
    address: v3_1.default
        .string({ message: "Phone number must be a string." })
        .min(2, { message: "Address minimum 2 character long." })
        .max(2000, { message: "Address max 2000 character long." })
        .optional(),
});
/*
 * ======================================
 * Update user zod schema
 * ======================================
 */
exports.updateUserZodSchema = v3_1.default.object({
    name: v3_1.default
        .string({ message: "Name must be string." })
        .min(2, { message: "Name must be 2 character long." })
        .max(100, { message: "Name must less than 100 character" })
        .optional(),
    phone: v3_1.default
        .string({ message: "Phone number must be a string." })
        .regex(/^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/, {
        message: "Invalid Bangladeshi phone number.",
    })
        .optional(),
    address: v3_1.default
        .string({ message: "Phone number must be a string." })
        .min(2, { message: "Address minimum 2 character long." })
        .max(2000, { message: "Address max 2000 character long." })
        .optional(),
    isDeleted: v3_1.default
        .boolean({ message: "isDeleted must be a boolean value" })
        .optional(),
    isActive: v3_1.default.enum(Object.values(user_interfaces_1.IsActive)).optional(),
    isVerified: v3_1.default
        .boolean({ message: "isVarified must be a boolean value" })
        .optional(),
    role: v3_1.default.enum(Object.values(user_interfaces_1.Role)).optional(),
});
//# sourceMappingURL=user.validation.js.map