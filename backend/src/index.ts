import express from "express"
import rootRouter from "./routes/index"
import cors from "cors"
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {JWT_SECRET} from "./config"
import dotenv from "dotenv";
dotenv.config();


const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()

const server = http.createServer(app); // Create HTTP server

app.use("/api/v1", rootRouter)

app.get("/", (req, res) => {
    res.json({
        msg: "Hi from the root router"
    })
})


// ----------------------
// 2. Create Socket.IO server
// ----------------------
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Map for online users
const onlineUsers = new Map<number, string>();

// ----------------------
// 3. Authenticate socket
// ----------------------
io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.query?.token;

  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication failed"));
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: number };

    socket.data.userId = decoded.userId;
    console.log("Authenticated socket user:", decoded.userId);

    next();
  } catch (err) {
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

  socket.on("join_conversation", (conversationId: number) => {
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

      io.to(`conversation_${conversationId}`).emit(
        "new_message",
        message
      );
    } catch (err) {
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
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
