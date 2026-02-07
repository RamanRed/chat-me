"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export function useSocket() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return socket;
}
