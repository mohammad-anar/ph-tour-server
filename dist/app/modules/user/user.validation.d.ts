import z from "zod/v3";
export declare const createUserZodSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    address?: string | undefined;
}, {
    name: string;
    email: string;
    password: string;
    phone?: string | undefined;
    address?: string | undefined;
}>;
export declare const updateUserZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    isDeleted: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodEnum<[string]>>;
    isVerified: z.ZodOptional<z.ZodBoolean>;
    role: z.ZodOptional<z.ZodEnum<[string]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    isDeleted?: boolean | undefined;
    isActive?: string | undefined;
    isVerified?: boolean | undefined;
    role?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    isDeleted?: boolean | undefined;
    isActive?: string | undefined;
    isVerified?: boolean | undefined;
    role?: string | undefined;
}>;
//# sourceMappingURL=user.validation.d.ts.map