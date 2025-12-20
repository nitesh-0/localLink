import { useEffect, useState } from "react";
// @ts-ignore
import { connectSocket, getSocket } from "../socket";
import axios from "axios";
import AppBar from "../components/AppBar";

/* ================= TYPES ================= */

type User = {
  name: string;
  role: string;
};

type Business = {
  businessName: string;
};

type Message = {
  id?: number;
  text: string;
  conversationId: number;
  sender: User;
};

type Conversation = {
  id: number;
  user?: User;
  business?: Business;
  messages: Message[];
};

/* ================= COMPONENT ================= */

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token") || "";
  const userId = Number(localStorage.getItem("userId"));

  /* ================= CONNECT SOCKET + LOAD CONVERSATIONS ================= */

  useEffect(() => {
    // 1️⃣ Connect socket ONCE
    connectSocket(token);

    // 2️⃣ Fetch conversations
    axios
      .get("http://localhost:3000/api/v1/chat/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // IMPORTANT: backend must return conversations array
        setConversations(res.data.conversations);
        setRole(res.data.role);
      })
      .catch((err) => {
        console.error("Failed to fetch conversations", err);
      });
  }, []);

  /* ================= SOCKET RECEIVE (REALTIME) ================= */

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("new_message", (message: Message) => {
      // Only update if message belongs to open chat
      if (message.conversationId === activeConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [activeConversation]);

  /* ================= LOAD MESSAGES ================= */

  const loadMessages = (conversationId: number) => {
    axios
      .get(`http://localhost:3000/api/v1/chat/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  };

  /* ================= SELECT CONVERSATION ================= */

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id);

    // Join socket room
    const socket = getSocket();
    socket.emit("join_conversation", conv.id);
  };

  /* ================= SEND MESSAGE (SOCKET ONLY) ================= */

  const sendMessage = () => {
    if (!activeConversation || newMessage.trim() === "") return;

    const socket = getSocket();

    socket.emit("send_message", {
      conversationId: activeConversation.id,
      text: newMessage,
    });

    // DO NOT push message manually
    setNewMessage("");
  };

  /* ================= UI ================= */

  return (
  <div className="h-screen flex flex-col bg-[#F0F0F0]">
    {/* APP BAR (fixed height, non-scrollable) */}
    <div className="h-14 mb-6 shrink-0">
      <AppBar />
    </div>

    {/* MAIN CHAT SECTION (fills remaining height) */}
    <div className="flex flex-1 overflow-hidden">
      
      {/* LEFT PANEL (scrollable list only) */}
      <div className="w-[30%] border-r border-gray-300 flex flex-col">
        <h3 className="p-2.5 text-md shrink-0">Chats</h3>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectConversation(c)}
              className={`p-2.5 cursor-pointer border-b border-gray-300 ${
                activeConversation?.id === c.id
                  ? "bg-gray-300"
                  : "bg-[#F0F0F0]"
              }`}
            >
              {role === "USER"
                ? c.business?.businessName
                : c.user?.name}

              <br />
              <small className="text-gray-500">
                {c.messages[0]?.text || "No messages yet"}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL (non-scrollable container) */}
      <div className="w-[70%] p-2.5 flex flex-col">
        {activeConversation ? (
          <>
            {/* Messages (scrollable only here) */}
            <div className="flex-1 overflow-y-auto bg-[#90AB8B] rounded-md p-3 mb-2.5 flex flex-col gap-2">
              {messages.map((m, index) => {
                const isSentByMe = m.sender.id === userId;

                return (
                  <div
                    key={index}
                    className={`max-w-[65%] px-3 py-2 rounded-lg text-sm ${
                      isSentByMe
                        ? "ml-auto bg-black text-white"
                        : "mr-auto bg-white text-black border"
                    }`}
                  >
                    {m.text}
                  </div>
                );
              })}
            </div>

            {/* Input (always visible) */}
            <div className="flex mb-5 gap-2.5 shrink-0">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2.5 border border-gray-300 rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                onClick={sendMessage}
                className="px-4 py-2.5 bg-black text-white rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  </div>
);

}

