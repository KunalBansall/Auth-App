const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  avatar: { type: String },
  chatroomId: { type: String, required: true }, // New field for chatroom ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
