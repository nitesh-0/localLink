import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: { role?: string; [key: string]: any };
    }
  }
}

const router = express.Router()
const prisma  =  new PrismaClient()


router.post("/start", authMiddleware, async (req: Request, res: Response)=> {
  try {
    const userIdentity = req.userId || ""; // from JWT middleware
    const userId = parseInt(userIdentity)
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

    res.json(conversation);
  }

  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start conversation" });
  }
})

router.get("/conversations", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.userId);

    console.log("FETCHING CONVERSATIONS FOR USER:", userId);

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId },
          { businessId: userId }
        ],
      },
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

    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});



 router.get("/:conversationId/messages", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      include: { sender: true },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  }
  
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


router.post("/:conversationId/messages", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required" });
    }

    const senderIdentity = req.userId || "";
    const senderId = parseInt(senderIdentity);

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});



export default router