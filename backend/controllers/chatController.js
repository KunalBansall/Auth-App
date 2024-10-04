const Message = require("../models/messageModel");
const users = {}; // In-memory store for socket connections

exports.handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When a user joins, store their socket ID
    socket.on("joinChat", async (userId) => {
      users[userId] = socket.id;

      try {
        // Fetch chat history between the user and their recipient
        const chatHistory = await Message.find({
          $or: [
            { sender: userId },
            { recipient: userId }
          ],
        }).sort({ createdAt: 1 }); // Sort by message time

        socket.emit("chatHistory", chatHistory); // Send chat history to client
      } catch (error) {
        console.error("Error fetching chat history:", error);
        socket.emit("error", { message: "Failed to load chat history" });
      }
    });

    // Handle sending messages
    socket.on("sendMessage", async (msg) => {
      const { text, sender, recipient } = msg;

      try {
        const newMessage = new Message({
          text,
          sender,
          recipient,
        });
        await newMessage.save();

        const recipientSocketId = users[recipient];
        if (recipientSocketId) {
          // Send message to recipient if they are online
          io.to(recipientSocketId).emit("receiveMessage", newMessage);
        }

        // Emit the message back to the sender
        socket.emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle user disconnect
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