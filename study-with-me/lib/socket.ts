import { io, Socket } from "socket.io-client";

/**
 * IMPORTANT:
 * - Do NOT connect immediately
 * - Control connection manually
 */
const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"], // force websocket
  withCredentials: true,
});
