const socketIo = require("socket.io");
const Message = require("./models/messageModel");

const users = {}; // Store user sockets

module.exports = (server) => {
  const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (userId) => {
      console.log("User joined chat:", userId); // Add this log


      users[userId] = socket.id;
    });

    socket.on("sendMessage", async (msg) => {
      const { text, sender, recipient } = msg;
      const newMessage = new Message({ text, sender, recipient });
      await newMessage.save();
      console.log(msg);

      const recipientSocketId = users[recipient];
      console.log("Recipient Socket ID:", recipientSocketId); // Add this log

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", newMessage);
      }
       else {
    console.log("Recipient is not connected.");
  }
    });

    socket.on("disconnect", () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};
