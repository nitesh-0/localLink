import zod from "zod"

export const userSignupZod = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    imageUrl: zod.string().optional(),
    location: zod.string().optional(),
    category: zod.string().optional(),
    role: zod.enum(["USER", "BUSINESS"]),
    name: zod.string().optional(),
    businessName: zod.string().optional()
}).refine((data) => {
    if (data.role === "USER") return !!data.name;
    if (data.role === "BUSINESS") return !!data.businessName;
    if (data.role === "BUSINESS") return !!data.location;
    if (data.role === "BUSINESS") return !!data.category;
    return true;
}, {
    message: "Name is required for USER or Business Name for BUSINESS"
});

export const userSigninZod = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

export const userUpdateZod = zod.object({
    password: zod.string().min(6).optional(),
    imageUrl: zod.string().optional(),
    location: zod.string().optional(),
    name: zod.string().optional(),
    businessName: zod.string().optional(),
    category: zod.string().optional()
})


export const productCreateZod = zod.object({
    name: zod.string(),
    price: zod.number(),
    caption: zod.string().optional(),
    imageUrl: zod.string().optional()
})

export const productUpdateZod = zod.object({
    name: zod.string().optional(),
    price: zod.number().optional(),
    imageUrl: zod.array(zod.string().optional()).optional(),
    caption: zod.string().optional(),
})