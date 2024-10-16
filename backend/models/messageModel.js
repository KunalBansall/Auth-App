const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroomId: { type: String, required: true }, 
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  text: { type: String, required: true },
  avatar: { type: String },
  mediaUrl: { type:String , default :''},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
