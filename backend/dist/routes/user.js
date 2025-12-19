"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const zod_1 = require("../zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../cloudinary");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../email");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Memory storage keeps file in memory as Buffer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
function generateToken() {
    return crypto_1.default.randomBytes(32).toString("hex");
}
router.post("/create", upload.single("image"), async (req, res) => {
    const body = req.body;
    const isCorrectInput = zod_1.userSignupZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.status(411).json({
            msg: "Incorrect input type"
        });
        return;
    }
    try {
        let imageUrl = "";
        // Check if file exists
        if (req.file) {
            // req.file.buffer contains the binary data
            imageUrl = await (0, cloudinary_1.uploadBufferToCloudinary)(req.file.buffer, "localLink.AI");
        }
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
                location: body.location,
                imageUrl,
                name: body.name,
                businessName: body.businessName,
                role: body.role,
                category: body.category
            }
        });
        const userId = newUser.id;
        const userRole = newUser.role;
        const token = jsonwebtoken_1.default.sign({
            userId, userRole
        }, config_1.JWT_SECRET);
        // create token
        const email_token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        const created_token = await prisma.emailVerificationToken.create({
            data: {
                userId: newUser.id,
                token: email_token,
                expiresAt,
            },
        });
        // send email
        await (0, email_1.sendVerificationEmail)(body.email, email_token);
        res.json({
            msg: "Registered-Check your email to verify",
            token,
            newUser,
            created_token
        });
    }
    catch (e) {
        res.json({
            msg: "User already exists",
            error: e
        });
    }
});
router.post("/signin", async (req, res) => {
    const body = req.body;
    const isCorrectInput = zod_1.userSigninZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.status(411).json({
            msg: "Incorrect input format"
        });
        return;
    }
    try {
        const isValid = await prisma.user.findFirst({
            where: {
                email: body.email,
                password: body.password
            }
        });
        const userId = isValid?.id;
        const userRole = isValid?.role;
        const token = jsonwebtoken_1.default.sign({
            userId, userRole
        }, config_1.JWT_SECRET);
        res.json({
            token,
            isValid
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "user doesn't exists",
            error: e
        });
    }
});
router.get("/me", middleware_1.authMiddleware, async (req, res) => {
    //const userId = req.userId ? parseInt(req.userId) : undefined
    if (!req.userId) {
        return res.status(401).json({ msg: "User not authenticated" });
    }
    try {
        const userDetails = await prisma.user.findFirst({
            where: {
                id: parseInt(req.userId)
            }
        });
        res.json({
            userDetails
        });
    }
    catch (e) {
        res.json({
            msg: "an unexpected error occurred",
            error: e
        });
    }
});
router.put("/update", middleware_1.authMiddleware, async (req, res) => {
    const body = req.body;
    const isCorrectInput = zod_1.userUpdateZod.safeParse(body);
    if (!isCorrectInput.success) {
        res.json({
            msg: "Incorrect input type"
        });
        return;
    }
    if (!req.userId) {
        return res.status(401).json({ msg: "User not authenticated" });
    }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(req.userId)
            },
            data: {
                password: body.password,
                location: body.location,
                imageUrl: body.imageUrl,
                name: body.name,
                businessName: body.businessName,
                category: body.category
            }
        });
        res.json({
            updatedUser
        });
    }
    catch (e) {
        res.json({
            msg: "unexpected error occurred",
            error: e
        });
    }
});
router.delete("/delete", middleware_1.authMiddleware, async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ msg: "User not authenticated" });
    }
    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: parseInt(req.userId)
            }
        });
        res.json({
            deletedUser
        });
    }
    catch (e) {
        res.json({
            msg: "unexpected error",
            error: e
        });
    }
});
// Verify route
router.post("/verify", async (req, res) => {
    try {
        const { token, email } = req.body;
        if (!token) {
            return res.status(400).json({
                message: "Token missing"
            });
        }
        console.log("here is your token: ", token);
        const record = await prisma.emailVerificationToken.findUnique({
            where: {
                token
            }
        });
        console.log("Here is your user detail:", record);
        if (!record) {
            res.status(400).json({
                message: "User already verified"
            });
            return;
        }
        if (record.expiresAt < new Date()) {
            // cleanup expired token
            await prisma.emailVerificationToken.delete({
                where: {
                    id: record.id
                }
            });
            return res.status(400).json({
                message: "Token expired"
            });
        }
        const findPeople = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        // mark user verified
        await prisma.user.update({
            where: {
                id: record.userId
            },
            data: {
                isVerified: true
            }
        });
        // delete token
        await prisma.emailVerificationToken.delete({
            where: {
                id: record.id
            }
        });
        return res.json({
            message: "Email verified",
            findPeople
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
});
// Resend verification (by email)
router.post("/resend-verification", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user.isVerified)
            return res.status(400).json({ message: "Already verified" });
        // delete old tokens (optional)
        await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await prisma.emailVerificationToken.create({ data: { userId: user.id, token, expiresAt } });
        await (0, email_1.sendVerificationEmail)(email, token);
        return res.json({ message: "Verification email resent" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map