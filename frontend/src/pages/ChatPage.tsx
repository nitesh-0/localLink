import { useEffect, useState } from "react";
// @ts-ignore
import { connectSocket, getSocket } from "../socket";

type User = {
  name: string;
};

type Business = {
  businessName: string;
};

type Message = {
  text: string;
  sender?: any;
};

type Conversation = {
  id: number;
  user?: User;
  business?: Business;
  messages: Message[];
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Load conversations once
  useEffect(() => {
    const token = localStorage.getItem("token");
    connectSocket(token || "");

    fetch("http://localhost:3000/api/v1/chat/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Conversation[]) => setConversations(data));
  }, []);

    // Load messages when conversation is clicked
    const loadMessages = (conversationId: number) => {
    const token = localStorage.getItem("token") || "";

    fetch(`http://localhost:3000/api/v1/chat/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data));
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id);

    // Join socket room
    const socket = getSocket();
    socket.emit("join_conversation", conv.id);
  };

  // Send message via POST API
  const sendMessage = async () => {
    if (!activeConversation || newMessage.trim() === "") return;

    const token = localStorage.getItem("token") || "";

    const res = await fetch(
      `http://localhost:3000/api/v1/chat/${activeConversation.id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMessage }),
      }
    );

    const data = await res.json();

    // Push message to UI
    setMessages((prev) => [...prev, data]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT PANEL */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <h3 style={{ padding: "10px" }}>Chats</h3>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelectConversation(c)}
            style={{
              padding: "10px",
              cursor: "pointer",
              background: activeConversation?.id === c.id ? "#eee" : "white",
              borderBottom: "1px solid #ddd",
            }}
          >
            {c.user?.name || c.business?.businessName}
            <br />
            <small style={{ color: "gray" }}>
              {c.messages[0]?.text || "No messages yet"}
            </small>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: "70%", padding: "10px" }}>
        {activeConversation ? (
          <div>
            {/* Messages */}
            <div
              style={{
                height: "75vh",
                overflowY: "auto",
                background: "#f7f7f7",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((m, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <strong>{m.sender?.name || "User"}:</strong> {m.text}
                </div>
              ))}
            </div>

            {/* Input + Send */}
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />

              <button
                onClick={sendMessage}
                style={{
                  padding: "10px 15px",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div>Select a conversation</div>
        )}
      </div>
    </div>
  );
}
