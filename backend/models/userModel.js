const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
     type: String,
      required: true,
    },
  avatar: {
    type: String,
    default:
      "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png",
  },
  
});

module.exports = mongoose.model("User", userSchema);
