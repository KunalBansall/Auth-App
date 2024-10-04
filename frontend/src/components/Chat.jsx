import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Chat = () => {
  const { userId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatWindowRef = React.useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.emit("joinChat", user._id);

      socket.on("chatHistory", (history) => {
        setChatHistory(history);
      });

      socket.on("receiveMessage", (msg) => {
        if (msg.sender === userId || msg.recipient === user._id) {
          setChatHistory((prev) => [...prev, msg]);
        }
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, [isAuthenticated, userId, user]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!user) return;
    if (!userId) return;

    const msg = {
      text: message,
      sender: user._id,
      recipient: userId,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", msg);
    setChatHistory((prev) => [...prev, msg]);
    setMessage("");
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-4">
      <div
        ref={chatWindowRef}
        className="chat-window flex flex-col overflow-auto h-full bg-gray-800 rounded-lg p-4 space-y-2"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.sender === user._id
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              <p className="text-sm">
                {msg.sender === user._id ? "You" : msg.sender}: {msg.text}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;