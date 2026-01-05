import { useEffect, useState } from "react";
// @ts-ignore
import { connectSocket, getSocket } from "../socket";
import axios from "axios";
import AppBar from "../components/AppBar";
import { useParams} from "react-router-dom";
import { useRecoilState } from "recoil";
import {  notificationMapState } from "../recoil/atoms";


export type User = {
  id: number;
  name: string;
  role: string;
};


export type Business = {
  businessName: string;
};

export type Message = {
  id?: number;
  text: string;
  conversationId: number;
  sender: User;
};

export type Conversation = {
  id: number;
  user?: User;
  business?: Business;
  messages: Message[];
};

//COMPONENT
export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [role, setRole] = useState("");
  const [notificationMap, setNotificationMap] = useRecoilState(notificationMapState)

  const token = localStorage.getItem("token") || "";
  const userId = Number(localStorage.getItem("userId"));
  const {id} = useParams()
  const autoConvId = id ? Number(id) : null;
  



  //CONNECT SOCKET + LOAD CONVERSATIONS 
  useEffect(() => {
    // 1️⃣ Connect socket ONCE
    connectSocket(token);

    // 2️⃣ Fetch conversations
    axios
      .get("https://locallink-lg2y.onrender.com/api/v1/chat/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // IMPORTANT: backend must return conversations array
        const convs = res.data.conversations;
        setConversations(convs);
        setRole(res.data.role);

        // AUTO SELECT CONVERSATION
        if (autoConvId) {
          const found = convs.find(
            (c: Conversation) => c.id === autoConvId
          );

          console.log("found conversation: ", found)

          if (found) {
            setActiveConversation(found);
            loadMessages(found.id);

            const socket = getSocket();
            if (socket) {
              socket.emit("join_conversation", found.id);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch conversations", err);
      });
  }, []);

  //SOCKET RECEIVE (REALTIME) 
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

 // LOAD MESSAGES
  const loadMessages = (conversationId: number) => {
    axios.get(`https://locallink-lg2y.onrender.com/api/v1/chat/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      });
  };

  // SELECT CONVERSATION 
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id);

    // Join socket room
    const socket = getSocket();
    if (!socket) return;
    socket.emit("join_conversation", conv.id);

    setNotificationMap((prev) => {
    const copy = { ...prev };
    delete copy[conv.id];
    return copy;
  });

  };

  // SEND MESSAGE (SOCKET ONLY) 
  const sendMessage = () => {
    if (!activeConversation || newMessage.trim() === "") return;

    const socket = getSocket();

    if (!socket) return;

    socket.emit("send_message", {
      conversationId: activeConversation.id,
      text: newMessage,
    });

    // DO NOT push message manually
    setNewMessage("");
  };


  return (
  <div className="h-screen flex flex-col bg-[#F0F0F0]">
    {/* APP BAR */}
    <div className="h-14 mb-2 shrink-0">
      <AppBar />
    </div>

    {/* MAIN CHAT SECTION */}
    <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
      
      {/* LEFT PANEL */}
      <div className="
        w-full md:w-[30%]
        border-b md:border-b-0 md:border-r border-gray-300
        flex flex-col
        max-h-[40vh] md:max-h-full
      ">
        <h3 className="p-2.5 text-md shrink-0">Chats</h3>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => handleSelectConversation(c)}
              className={`p-2.5 cursor-pointer border-b border-gray-300 flex justify-between items-center ${
                activeConversation?.id === c.id
                  ? "bg-gray-300"
                  : "bg-[#F0F0F0]"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {role === "USER"
                    ? c.business?.businessName
                    : c.user?.name}
                </span>

                <small className="text-gray-500 max-w-[200px] truncate">
                  {c.messages[0]?.text || "No messages yet"}
                </small>
              </div>

              {notificationMap[c.id] > 0 && (
                <span className="
                  min-w-[18px] h-[18px] px-1
                  flex items-center justify-center
                  text-[11px] font-semibold
                  bg-red-600 text-white
                  rounded-full
                ">
                  {notificationMap[c.id] > 9 ? "9+" : notificationMap[c.id]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[70%] p-2.5 flex flex-col">
        {activeConversation ? (
          <>
            {/* Messages */}
            <div className="
              flex-1 overflow-y-auto
              bg-[#90AB8B] rounded-md
              p-3 mb-2.5
              flex flex-col gap-2
            ">
              {messages.map((m, index) => {
                const isSentByMe = m.sender.id === userId;

                return (
                  <div
                    key={index}
                    className={`max-w-[75%] md:max-w-[65%]
                      px-3 py-2 rounded-lg text-sm
                      ${
                        isSentByMe
                          ? "ml-auto bg-black text-white"
                          : "mr-auto bg-white text-black border"
                      }
                    `}
                  >
                    {m.text}
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="flex gap-2.5 shrink-0">
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