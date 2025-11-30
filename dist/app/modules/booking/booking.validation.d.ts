import z from "zod/v3";
export declare const createBookingZodSchema: z.ZodObject<{
    tour: z.ZodString;
    guestCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tour: string;
    guestCount: number;
}, {
    tour: string;
    guestCount: number;
}>;
export declare const updateBookingZodSchema: z.ZodObject<{
    status: z.ZodEnum<[string]>;
}, "strip", z.ZodTypeAny, {
    status: string;
}, {
    status: string;
}>;
//# sourceMappingURL=booking.validation.d.ts.map