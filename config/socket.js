// config/socket.js
import { Server } from "socket.io";

export let io;

// store online users for tracking (key value pairs - key:userId, value: socket.id)
export const userSoketMap = {}; //{userId: soketId}

export const setupSocket = (server) => {
  //initialize soket.io server
  io = new Server(server, { cors: { origin: "*" } });

  //Soket.io connection handler

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) userSoketMap[userId] = socket.id;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSoketMap));

    socket.on("disconnect", () => {
      console.log("Disconnect", userId);
      delete userSoketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSoketMap));
    });
  });

  return io;
};
