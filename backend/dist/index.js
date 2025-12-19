"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
const server = http_1.default.createServer(app); // Create HTTP server
app.use("/api/v1", index_1.default);
app.get("/", (req, res) => {
    res.json({
        msg: "Hi from the root router"
    });
});
// ----------------------
// 2. Create Socket.IO server
// ----------------------
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// Map for online users
const onlineUsers = new Map();
// ----------------------
// 3. Authenticate socket
// ----------------------
io.use((socket, next) => {
    const token = socket.handshake.auth?.token ||
        socket.handshake.query?.token;
    if (!token) {
        console.log("No token provided");
        return next(new Error("Authentication failed"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        socket.data.userId = decoded.userId;
        console.log("Authenticated socket user:", decoded.userId);
        next();
    }
    catch (err) {
        console.log("JWT Error:", err);
        next(new Error("Authentication failed"));
    }
});
// ----------------------
// 4. Socket events
// ----------------------
io.on("connection", (socket) => {
    const userId = socket.data.userId;
    onlineUsers.set(userId, socket.id);
    console.log("User connected:", userId);
    socket.on("join_conversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);
    });
    socket.on("send_message", async ({ conversationId, text }) => {
        try {
            const message = await prisma.message.create({
                data: {
                    conversationId,
                    senderId: userId,
                    text,
                },
                include: { sender: true },
            });
            await prisma.conversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date() },
            });
            io.to(`conversation_${conversationId}`).emit("new_message", message);
        }
        catch (err) {
            console.error("Message error:", err);
        }
    });
    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        console.log("User disconnected:", userId);
    });
});
// ----------------------
// 5. Start server
// ----------------------
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map