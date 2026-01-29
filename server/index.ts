import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Next.js
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const emailToSocket = new Map<string, string>();
const socketToRoom = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join room
  socket.on("join_room", ({ roomCode, emailId }) => {
    emailToSocket.set(emailId, socket.id);
    socket.join(roomCode);
    socketToRoom.set(socket.id, roomCode);

    console.log(`${emailId} joined room ${roomCode}`);

    socket.to(roomCode).emit("user_joined", { emailId });
  });

  // WebRTC signaling
  socket.on("offer", (offer) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) {
      socket.to(roomCode).emit("offer", offer);
    }
  });

  socket.on("answer", (answer) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) {
      socket.to(roomCode).emit("answer", answer);
    }
  });

  socket.on("ice_candidate", (candidate) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) {
      socket.to(roomCode).emit("ice_candidate", candidate);
    }
  });

  // Leave room manually
  socket.on("leave_room", ({ roomCode }) => {
    socket.leave(roomCode);
    socketToRoom.delete(socket.id);
    socket.to(roomCode).emit("user_left");
  });

  // Disconnect
  socket.on("disconnect", () => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) {
      socket.to(roomCode).emit("user_left");
      socketToRoom.delete(socket.id);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(9000, () => {
  console.log("Socket server running on port 9000");
});
