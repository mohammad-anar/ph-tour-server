import z from "zod/v3";
import { IsActive, Role } from "./user.interfaces";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string." })
    .min(2, { message: "Name must be 2 character long." })
    .max(100, { message: "Name must less than 100 character" }),
  email: z
    .string({ message: "Email must be a string." })
    .email({ message: "Invalid email format." })
    .min(2, { message: "Email minimum 2 character long." })
    .max(100, { message: "Email maximum 100 character long." }),
  password: z
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
  phone: z
    .string({ message: "Phone number must be a string." })
    .regex(/^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message: "Invalid Bangladeshi phone number.",
    })
    .optional(),
  address: z
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

export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string." })
    .min(2, { message: "Name must be 2 character long." })
    .max(100, { message: "Name must less than 100 character" })
    .optional(),
  password: z
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
    })
    .optional(),
  phone: z
    .string({ message: "Phone number must be a string." })
    .regex(/^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8})$/, {
      message: "Invalid Bangladeshi phone number.",
    })
    .optional(),
  address: z
    .string({ message: "Phone number must be a string." })
    .min(2, { message: "Address minimum 2 character long." })
    .max(2000, { message: "Address max 2000 character long." })
    .optional(),
  isDeleted: z
    .boolean({ message: "isDeleted must be a boolean value" })
    .optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z
    .boolean({ message: "isVarified must be a boolean value" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
});
