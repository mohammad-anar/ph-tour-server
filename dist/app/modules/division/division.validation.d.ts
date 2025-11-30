import z from "zod/v3";
export declare const createDivisionZodSchema: z.ZodObject<{
    name: z.ZodString;
    thumbnail: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    thumbnail?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    thumbnail?: string | undefined;
}>;
export declare const updateDivisionZodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    thumbnail?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    thumbnail?: string | undefined;
}>;
//# sourceMappingURL=division.validation.d.ts.map