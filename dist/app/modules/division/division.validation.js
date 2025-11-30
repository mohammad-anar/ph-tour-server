"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
exports.createDivisionZodSchema = v3_1.default.object({
    name: v3_1.default.string({ message: "Name is required" }),
    thumbnail: v3_1.default.string().optional(),
    description: v3_1.default.string().optional(),
});
exports.updateDivisionZodSchema = v3_1.default.object({
    name: v3_1.default.string().optional(),
    thumbnail: v3_1.default.string().optional(),
    description: v3_1.default.string().optional(),
});
//# sourceMappingURL=division.validation.js.map