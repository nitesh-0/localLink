"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productUpdateZod = exports.productCreateZod = exports.userUpdateZod = exports.userSigninZod = exports.userSignupZod = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSignupZod = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    imageUrl: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    category: zod_1.default.string().optional(),
    role: zod_1.default.enum(["USER", "BUSINESS"]),
    name: zod_1.default.string().optional(),
    businessName: zod_1.default.string().optional()
}).refine((data) => {
    if (data.role === "USER")
        return !!data.name;
    if (data.role === "BUSINESS")
        return !!data.businessName;
    if (data.role === "BUSINESS")
        return !!data.location;
    if (data.role === "BUSINESS")
        return !!data.category;
    return true;
}, {
    message: "Name is required for USER or Business Name for BUSINESS"
});
exports.userSigninZod = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.userUpdateZod = zod_1.default.object({
    password: zod_1.default.string().min(6).optional(),
    imageUrl: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    name: zod_1.default.string().optional(),
    businessName: zod_1.default.string().optional(),
    category: zod_1.default.string().optional()
});
exports.productCreateZod = zod_1.default.object({
    name: zod_1.default.string(),
    price: zod_1.default.number(),
    caption: zod_1.default.string().optional(),
    imageUrl: zod_1.default.string().optional()
});
exports.productUpdateZod = zod_1.default.object({
    name: zod_1.default.string().optional(),
    price: zod_1.default.number().optional(),
    imageUrl: zod_1.default.array(zod_1.default.string().optional()).optional(),
    caption: zod_1.default.string().optional(),
});
//# sourceMappingURL=zod.js.map