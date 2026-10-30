import { io, type Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3333";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export const startSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const stopSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};