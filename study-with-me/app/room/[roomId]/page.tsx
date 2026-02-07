"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();

  const {
    createPeer,
    getMedia,
    setupSignaling,
    pcRef,
    cleanup,
  } = useWebRTC(socket);

  useEffect(() => {
    // ❌ DO NOT reconnect socket here
    // Socket is already connected from homepage

    async function init() {
      await createPeer();
      await getMedia();
      setupSignaling();
    }

    init();

    // ✅ Only THIS side creates offer when second user joins
    const handleUserJoined = async () => {
      const pc = pcRef.current;
      if (!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", offer);
    };

    const handleUserLeft = () => {
      cleanup();
      alert("Other user left");
      router.push("/");
    };

    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);

      socket.emit("leave_room", { roomCode: roomId });
      cleanup();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <video
          id="localVideo"
          autoPlay
          muted
          playsInline
          className="w-1/2 border"
        />
        <video
          id="remoteVideo"
          autoPlay
          playsInline
          className="w-1/2 border"
        />
      </div>

      <button
        onClick={() => {
          socket.emit("leave_room", { roomCode: roomId });
          cleanup();
          router.push("/");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Leave
      </button>
    </div>
  );
}
