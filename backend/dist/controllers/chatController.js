"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/start", middleware_1.authMiddleware, async (req, res) => {
    try {
        const userIdentity = req.userId || ""; // from JWT middleware
        const userId = parseInt(userIdentity);
        const { businessId } = req.body;
        // Check if conversation exists
        let conversation = await prisma.conversation.findUnique({
            where: {
                userId_businessId: { userId, businessId },
            },
        });
        // If not, create a new one
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: { userId, businessId },
            });
        }
        res.json({
            conversation
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to start conversation" });
    }
});
router.get("/conversations", middleware_1.authMiddleware, async (req, res) => {
    try {
        const userIdentity = req.userId || "";
        const userId = parseInt(userIdentity);
        const userRole = req.role || "";
        console.log("FETCHING CONVERSATIONS FOR ->", { userId, userRole });
        const conversations = await prisma.conversation.findMany({
            where: userRole === "USER" ? { userId: userId } : { businessId: userId },
            include: {
                user: true,
                business: true,
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { updatedAt: "desc" },
        });
        console.log("CONVERSATIONS FOUND:", conversations);
        console.log(userRole);
        res.json({
            conversations,
            role: userRole
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
});
router.get("/:conversationId/messages", middleware_1.authMiddleware, async (req, res) => {
    console.log("loading message route got hit");
    try {
        const { conversationId } = req.params;
        const messages = await prisma.message.findMany({
            where: { conversationId: Number(conversationId) },
            include: { sender: true },
            orderBy: { createdAt: "asc" },
        });
        console.log(messages);
        res.json(messages);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
router.post("/:conversationId/messages", middleware_1.authMiddleware, async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Message text is required" });
        }
        const senderIdentity = req.userId || "";
        const senderId = parseInt(senderIdentity);
        const senderRole = req.role || "";
        console.log("senderId in new message route: ", senderId);
        console.log("sender role in new message route: ", senderRole);
        // Verify conversation exists
        const conversation = await prisma.conversation.findUnique({
            where: { id: Number(conversationId) },
        });
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        // Check if sender is valid (either userId or businessId must match)
        if (conversation.userId !== senderId && conversation.businessId !== senderId) {
            return res.status(403).json({ error: "You are not part of this conversation" });
        }
        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId: Number(conversationId),
                senderId,
                text,
            },
            include: {
                sender: true,
            },
        });
        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: Number(conversationId) },
            data: { updatedAt: new Date() },
        });
        res.json(message);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message" });
    }
});
exports.default = router;
//# sourceMappingURL=chatController.js.map