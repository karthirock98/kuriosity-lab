import { Server } from "socket.io";
import { validateAuthCookie } from "./auth.service.js";
import cookieParser from "cookie-parser";
let io;

const userSockets = new Map();
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    cookieParser()(socket.request, {}, async (err) => {
      if (err) {
        return next(new Error("Cookie parsing failed"));
      }

      try {
        const authCookie = socket.request.cookies?.auth;

        const decryptedCookie = await validateAuthCookie(authCookie);

        // Set it yourself, using the validated cookie data.
        socket.data.username = decryptedCookie.username;

        next();
      } catch {
        next(new Error("Unauthorized"));
      }
    });
  });

  io.on("connection", (socket) => {
    const username = socket.data.username;

    if (username) {
      userSockets.set(username, socket.id);
    }

    socket.on("disconnect", () => {
      if (username && userSockets.get(username) === socket.id) {
        userSockets.delete(username);
      }
    });
  });

  return io;
};

// this emit to react (client)
export const emitToSocket = (socketId, event, data) => {
  io?.to(socketId).emit(event, data);
};

export const emitToAll = (event, data) => {
  io?.emit(event, data);
};

export const getSocketId = (username) => {
  return userSockets.get(username);
};
