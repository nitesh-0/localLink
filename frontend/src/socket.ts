import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string | null): Socket | null => {
  if (!token) return null;

  if (!socket) {
    socket = io(
      import.meta.env.VITE_SOCKET_URL || "https://locallink-lg2y.onrender.com",
      {
        auth: { token },
        autoConnect: true,
      }
    );
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;
