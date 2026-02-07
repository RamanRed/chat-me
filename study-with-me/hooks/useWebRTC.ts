"use client";

import { useRef } from "react";

export function useWebRTC(socket: any) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // ✅ Create Peer Connection
  const createPeer = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // ICE candidates → signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", event.candidate);
      }
    };

    // Remote stream
    pc.ontrack = (event) => {
      const remoteVideo = document.getElementById(
        "remoteVideo"
      ) as HTMLVideoElement;

      if (remoteVideo && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ✅ Get user media + attach tracks
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const localVideo = document.getElementById(
      "localVideo"
    ) as HTMLVideoElement;

    if (localVideo) {
      localVideo.srcObject = stream;
      localVideo.muted = true;
    }

    localStreamRef.current = stream;

    // 🔴 MISSING PART (NOW FIXED)
    stream.getTracks().forEach((track) => {
      pcRef.current?.addTrack(track, stream);
    });

    return stream;
  };

  // ✅ Handle signaling events
  const setupSignaling = () => {
    socket.on("offer", async (offer: RTCSessionDescriptionInit) => {
      if (!pcRef.current) await createPeer();

      await pcRef.current!.setRemoteDescription(offer);
      const answer = await pcRef.current!.createAnswer();
      await pcRef.current!.setLocalDescription(answer);

      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer: RTCSessionDescriptionInit) => {
      await pcRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice_candidate", async (candidate: RTCIceCandidateInit) => {
      try {
        await pcRef.current?.addIceCandidate(candidate);
      } catch (err) {
        console.error("ICE error", err);
      }
    });
  };

  // ✅ Cleanup
  const cleanup = () => {
    socket.off("offer");
    socket.off("answer");
    socket.off("ice_candidate");

    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    localStreamRef.current = null;

    const remoteVideo = document.getElementById(
      "remoteVideo"
    ) as HTMLVideoElement;
    if (remoteVideo) remoteVideo.srcObject = null;
  };

  return {
    createPeer,
    getMedia,
    setupSignaling,
    pcRef,
    localStreamRef,
    cleanup,
  };
}
