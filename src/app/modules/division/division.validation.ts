import z from "zod/v3";

export const createDivisionZodSchema = z.object({
  name: z.string({ message: "Name is required" }),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
export const updateDivisionZodSchema = z.object({
  name: z.string().optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
