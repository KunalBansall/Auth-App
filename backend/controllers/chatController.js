const Message = require("../models/messageModel");
const users = {}; // In-memory store for socket connections

exports.handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a specific chatroom
    socket.on("joinChat", ({ userId, chatroomId }) => {
      if (!users[userId]) {
        users[userId] = socket.id;
      }

      socket.join(chatroomId); // Join the chatroom

      // Fetch chat history for the specific chatroom
      Message.find({ chatroomId })
        .sort({ createdAt: 1 }) // Sort by message time
        .then((chatHistory) => {
          socket.emit("chatHistory", chatHistory); // Send chat history to client
        })
        .catch((error) => {
          console.error("Error fetching chat history:", error);
          socket.emit("error", { message: "Failed to load chat history" });
        });
    });

    // Handle sending messages
    socket.on("sendMessage", async (msg, callback) => {
      const { text, sender, recipient, chatroomId } = msg;

      try {
        const newMessage = new Message({
          text,
          sender,
          recipient,
          chatroomId,
        });
        await newMessage.save();

        // Send message to the entire chatroom
        io.to(chatroomId).emit("receiveMessage", newMessage);

        // Emit the message back to the sender (optional if it's already in chatroom)
        // socket.emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
      callback({ status: "success" });
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
