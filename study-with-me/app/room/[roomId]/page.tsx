"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { createPeer, getMedia, pcRef, cleanup } = useWebRTC(socket);

  useEffect(() => {
    socket.connect();

    async function init() {
      const stream = await getMedia();
      const pc = await createPeer();

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    }

    init();

    socket.on("user_joined", async () => {
      const pc = pcRef.current!;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", offer);
    });

    socket.on("offer", async (offer) => {
      const pc = pcRef.current!;
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      await pcRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice_candidate", async (candidate) => {
      await pcRef.current?.addIceCandidate(candidate);
    });

    socket.on("user_left", () => {
      cleanup();
      alert("Other user left");
      router.push("/");
    });

    return () => {
      socket.emit("leave_room", { roomCode: roomId });
      socket.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <video id="localVideo" autoPlay muted playsInline className="w-1/2 border" />
        <video id="remoteVideo" autoPlay playsInline className="w-1/2 border" />
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
