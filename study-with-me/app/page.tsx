"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!email || !roomCode) {
      alert("Email and Room Code are required");
      return;
    }

    // If already connected, emit directly
    if (socket.connected) {
      socket.emit("join_room", {
        emailId: email,
        roomCode,
      });

      router.push(`/room/${roomCode}`);
      return;
    }

    // Otherwise wait for connection
    socket.connect();

    socket.once("connect", () => {
      socket.emit("join_room", {
        emailId: email,
        roomCode,
      });

      router.push(`/room/${roomCode}`);
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-3 p-6 border rounded-xl">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <button
          onClick={handleJoin}
          className="bg-gray-300 hover:bg-gray-400 rounded py-2"
        >
          Enter Room
        </button>
      </div>
    </div>
  );
}
