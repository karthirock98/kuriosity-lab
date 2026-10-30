import { useEffect } from "react";
import { socket, startSocket, stopSocket } from "@/services/socket.service";

export const useSocket = () => {
  useEffect(() => {
    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.log("Socket disconnected:", reason);
    };

    const onConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    startSocket();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      stopSocket();
    };
  }, []);
};