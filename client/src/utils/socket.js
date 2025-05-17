// utils/socket.js
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL;

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket Server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket Server");
    });
  }
  return socket;
};

export const getSocket = () => socket;
