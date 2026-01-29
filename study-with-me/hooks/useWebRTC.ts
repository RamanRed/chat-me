"use client";

import { useRef } from "react";

export function useWebRTC(socket: any) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const createPeer = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
    if (localVideo) {
      localVideo.srcObject = stream;
    }

    localStreamRef.current = stream;
    return stream;
  };

  return { createPeer, getMedia, pcRef, localStreamRef };
}
