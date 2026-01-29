import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Next.js
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const emailToSocketMapping = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", ({ roomCode, emailId }) => {
    console.log(`User ${emailId} joined room ${roomCode}`);

    emailToSocketMapping.set(emailId, socket.id);
    socket.join(roomCode);

    socket.to(roomCode).emit("user_joined", { emailId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(9000, () => {
  console.log("Socket server running on port 9000");
});
