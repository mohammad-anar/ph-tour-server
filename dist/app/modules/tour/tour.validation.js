"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTourTypeZodSchema = exports.updateTourZodSchema = exports.createTourZodSchema = void 0;
const v3_1 = require("zod/v3");
exports.createTourZodSchema = v3_1.z.object({
    title: v3_1.z.string(),
    description: v3_1.z.string().optional(),
    location: v3_1.z.string().optional(),
    costFrom: v3_1.z.number().optional(),
    startDate: v3_1.z.string().optional().optional(),
    endDate: v3_1.z.string().optional().optional(),
    tourType: v3_1.z.string(),
    included: v3_1.z.array(v3_1.z.string()).optional(),
    excluded: v3_1.z.array(v3_1.z.string()).optional(),
    amenities: v3_1.z.array(v3_1.z.string()).optional(),
    tourPlan: v3_1.z.array(v3_1.z.string()).optional(),
    maxGuest: v3_1.z.number().optional(),
    minAge: v3_1.z.number().optional(),
    division: v3_1.z.string(),
    departureLocation: v3_1.z.string().optional(),
    arrivalLocation: v3_1.z.string().optional(),
});
exports.updateTourZodSchema = v3_1.z.object({
    title: v3_1.z.string().optional(),
    description: v3_1.z.string().optional(),
    location: v3_1.z.string().optional(),
    costFrom: v3_1.z.number().optional(),
    startDate: v3_1.z.string().optional().optional(),
    endDate: v3_1.z.string().optional().optional(),
    tourType: v3_1.z.string().optional(),
    included: v3_1.z.array(v3_1.z.string()).optional(),
    excluded: v3_1.z.array(v3_1.z.string()).optional(),
    amenities: v3_1.z.array(v3_1.z.string()).optional(),
    tourPlan: v3_1.z.array(v3_1.z.string()).optional(),
    maxGuest: v3_1.z.number().optional(),
    minAge: v3_1.z.number().optional(),
    division: v3_1.z.string().optional(),
    departureLocation: v3_1.z.string().optional(),
    arrivalLocation: v3_1.z.string().optional(),
    deleteImages: v3_1.z.array(v3_1.z.string()).optional(),
});
exports.createTourTypeZodSchema = v3_1.z.object({
    name: v3_1.z.string(),
});
//# sourceMappingURL=tour.validation.js.map