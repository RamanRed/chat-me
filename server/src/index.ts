import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ ENV
const PORT = process.env.PORT || 3000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Middlewares
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Health check (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Chat-me backend is running 🚀");
});

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ❗ Remove TS generics if this is JS
const emailToSocket = new Map();
const socketToRoom = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", ({ roomCode, emailId }) => {
    emailToSocket.set(emailId, socket.id);
    socket.join(roomCode);
    socketToRoom.set(socket.id, roomCode);

    console.log(`${emailId} joined room ${roomCode}`);

    socket.to(roomCode).emit("user_joined", { emailId });
  });

  socket.on("offer", (offer) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) socket.to(roomCode).emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) socket.to(roomCode).emit("answer", answer);
  });

  socket.on("ice_candidate", (candidate) => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) socket.to(roomCode).emit("ice_candidate", candidate);
  });

  socket.on("leave_room", ({ roomCode }) => {
    socket.leave(roomCode);
    socketToRoom.delete(socket.id);
    socket.to(roomCode).emit("user_left");
  });

  socket.on("disconnect", () => {
    const roomCode = socketToRoom.get(socket.id);
    if (roomCode) {
      socket.to(roomCode).emit("user_left");
      socketToRoom.delete(socket.id);
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// ✅ MUST bind 0.0.0.0 for Render
server.listen(
  {
    port: PORT,
    host: "0.0.0.0",
  },
  () => {
    console.log(`Server running on port ${PORT}`);
  }
);
