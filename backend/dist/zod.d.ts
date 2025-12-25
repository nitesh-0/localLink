import zod from "zod";
export declare const userSignupZod: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
    imageUrl: zod.ZodOptional<zod.ZodString>;
    location: zod.ZodOptional<zod.ZodString>;
    category: zod.ZodOptional<zod.ZodString>;
    role: zod.ZodEnum<{
        USER: "USER";
        BUSINESS: "BUSINESS";
    }>;
    name: zod.ZodOptional<zod.ZodString>;
    businessName: zod.ZodOptional<zod.ZodString>;
}, zod.core.$strip>;
export declare const userSigninZod: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, zod.core.$strip>;
export declare const userUpdateZod: zod.ZodObject<{
    password: zod.ZodOptional<zod.ZodString>;
    imageUrl: zod.ZodOptional<zod.ZodString>;
    location: zod.ZodOptional<zod.ZodString>;
    name: zod.ZodOptional<zod.ZodString>;
    businessName: zod.ZodOptional<zod.ZodString>;
    category: zod.ZodOptional<zod.ZodString>;
}, zod.core.$strip>;
export declare const productCreateZod: zod.ZodObject<{
    name: zod.ZodString;
    price: zod.ZodNumber;
    caption: zod.ZodOptional<zod.ZodString>;
    imageUrl: zod.ZodOptional<zod.ZodString>;
}, zod.core.$strip>;
export declare const productUpdateZod: zod.ZodObject<{
    name: zod.ZodOptional<zod.ZodString>;
    price: zod.ZodOptional<zod.ZodNumber>;
    imageUrl: zod.ZodOptional<zod.ZodArray<zod.ZodOptional<zod.ZodString>>>;
    caption: zod.ZodOptional<zod.ZodString>;
}, zod.core.$strip>;
//# sourceMappingURL=zod.d.ts.map