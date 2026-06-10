// socket.js (node)

const { Server } = require("socket.io");
const { mySqlPool } = require("./config/db");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Join Room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      console.log(`Socket ${socket.id} joined room ${roomId}`);

      io.to(roomId).emit("user-joined", `A new user joined room ${roomId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const [room] = await mySqlPool.query(
          `
      SELECT id
      FROM rooms
      WHERE room_id = ?
      `,
          [data.roomId],
        );

        if (room.length === 0) {
          return;
        }

        const roomDbId = room[0].id;

        // TEMPORARY
        const senderId = 1;

        await mySqlPool.query(
          `
      INSERT INTO chat_messages
      (
        room_id,
        sender_id,
        message
      )
      VALUES (?, ?, ?)
      `,
          [roomDbId, senderId, data.message],
        );

        io.to(data.roomId).emit("receive-message", data);
      } catch (error) {
        console.error(`Chat Save Error: ${error.message}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
};
