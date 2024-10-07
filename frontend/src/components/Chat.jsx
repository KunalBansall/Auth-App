import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";

const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Chat = () => {
  const { userId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const chatWindowRef = React.useRef(null);

  useEffect(() => {
    const fetchChatUser = async (token) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        setChatUser(response.data);
        console.log("Chat User:", response.data); // Log the fetched user details
      } catch (error) {
        console.error("Error fetching Chat User details", error);
      }
    };
    if (isAuthenticated) {
      fetchChatUser(); // Fetch chat user when authenticated
      console.log("user ", user, "userid", user._id,"username", user.username);

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
    if (!message.trim() || !user || !userId) return;

    const msg = {
      text: message,
      sender: user._id,
      recipient: userId,
      createdAt: new Date(),
    };
    console.log("sender", user._id, " reciept",userId , "msg",message);

    socket.emit("sendMessage", msg);
    setChatHistory((prev) => [...prev, msg]);
    setMessage("");
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return ( <div className="flex flex-col h-screen bg-white p-4">
      <div className="text-gray-700 mb-4">
        {chatUser ? `Chatting with: ${chatUser.username}` : "Loading..."}
      </div>
      <div
        ref={chatWindowRef}
        className="chat-window flex flex-col overflow-auto h-full bg-gray-100 rounded-lg p-4 space-y-2"
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== user._id && (
              <img
                src={chatUser?.avatar}
                alt="user avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-3 rounded-lg max-w-[70%] ${
                msg.sender === user._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">
                <span className="font-semibold">
                  {msg.sender === user._id ? "You" : chatUser?.username}
                </span>
                : {msg.text}
              </p>
              <span
                className="text-xs text-gray-500"
                style={{ fontSize: "0.7rem", marginTop: "4px" }}
              >
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
          className="flex-grow p-3 rounded-lg bg-gray-200 text-black placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400"
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