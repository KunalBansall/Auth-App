const express = require("express");
const { sendMessage, getChatHistory } = require("../controllers/chatController");
const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/chat-history/:sender/:recipient", getChatHistory);

module.exports = router;
