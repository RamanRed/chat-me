"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useSocket() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected:", socket.id);
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  return socket;
}
