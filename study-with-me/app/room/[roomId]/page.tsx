"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/libs/socket";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function RoomPage() {
  const { roomId } = useParams();
  const { createPeer, getMedia, pcRef } = useWebRTC(socket);

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
      const pc = pcRef.current!;
      await pc.setRemoteDescription(answer);
    });

    socket.on("ice_candidate", async (candidate) => {
      const pc = pcRef.current!;
      await pc.addIceCandidate(candidate);
    });

    return () => {
      socket.disconnect();
      pcRef.current?.close();
    };
  }, []);

  return (
    <div className="flex gap-4 p-4">
      <video id="localVideo" autoPlay muted playsInline className="w-1/2 border" />
      <video id="remoteVideo" autoPlay playsInline className="w-1/2 border" />
    </div>
  );
}
