import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Firebase Firestore

// const API_URL = "https://auth-app-main-4bam.onrender.com";
const API_URL = "http://localhost:5000";
const socket = io(`${API_URL}`, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Utility function to generate chatroom ID
const getChatroomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join("-"); // Combine and sort user IDs
};

const Chat = () => {
  const { userId } = useParams(); // Get the userId from params
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const chatWindowRef = useRef(null);
  const [media, setMedia] = useState(null); // store media
  const storage = getStorage();

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(
        collection(getFirestore(), "messages")
      );
      let msgs = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().chatroomId === chatroomId) {
          msgs.push(doc.data());
        }
      });
      setMessages(msgs);
    };
    fetchMessages();
  }, []);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const uploadMedia = async (file) => {
    const storageRef = ref(storage, `chat-media/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      console.log("url", url);
      return url;
    } catch (error) {
      console.error("Error uplading file");
      return null;
    }
  };
  useEffect(() => {
    if (!isAuthenticated || !user || !user._id) {
      return;
    }

    const chatroomId = getChatroomId(user._id, userId); // Generate chatroom

    const fetchChatUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`);
        setChatUser(response.data);
      } catch (error) {
        console.error("Error fetching Chat User details", error);
      }
    };

    if (isAuthenticated) {
      fetchChatUser();

      socket.emit("joinChat", { userId: user._id, chatroomId }); // Use generated chatroomId

      socket.on("receiveMessage", (msg) => {
        // Update chat history for both sender and recipient
        if (msg.recipient === user._id || msg.sender === user._id) {
          setChatHistory((prev) => [...prev, msg]);
        }
      });
      socket.on("chatHistory", (history) => {
        setChatHistory(history);
      });
    }

    return () => {
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, [isAuthenticated, userId, user]);

  const sendMessage = async () => {
    if (!message.trim() || !user || !userId) return;

    const chatroomId = getChatroomId(user._id, userId); // Generate chatroom ID
    let mediaUrl = "";
    if (media) {
      mediaUrl = await uploadMedia(media);
      console.log("media url", mediaUrl);
    }
    const msg = {
      chatroomId,
      sender: user._id,
      recipient: userId,
      text: message,
      mediaUrl,
      createdAt: new Date(),
    };
    console.log("mesgge", msg);

    socket.emit("sendMessage", msg, (ack) => {
      if (ack.status === "success") {
        setMessage("");
        setMedia(null);
      } else {
        console.error("Message sending failed");
      }
    });
    setMessage(""); // Clear the message input
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight; // Scroll to the bottom of the chat window
    }
  }, [chatHistory]);

  if (!isAuthenticated || !user || !user._id) {
    return <div>Loading...</div>; // Display loading when not authenticated
  }

  return (
    <div className="flex flex-col h-screen bg-white p-4">
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
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm">
                <span className="font-semibold">
                  {msg.sender === user._id ? "You" : chatUser?.username}
                </span>
                : {msg.text}
              </p>

              {msg.mediaUrl && (
                <div className="mt-2">
                  msg.mediaUrl.endsWith(".jpg")||
                  msg.mediaUrl.endsWith(".png")|| msg.mediaUrl.endsWith(".jpeg")
                  ? (
                  <img
                    src={msg.mediaUrl}
                    alt="Media"
                    className="max-w-full rounded-lg"
                  />
                  ): msg.mediaUrl.endsWith(".mp4") ||
                  msg.mediaUrl.endsWith('.mov') ? (
                  <video controls className="max-w-full rounded-lg">
                    <source src={msg.mediaUrl} type="video/mp4" />
                    Your Browser
                  </video>
                  ) :(
                  <a
                    href={msg.mediaUrl}
                    target="_blank"
                    rel="nopener noreferrer"
                  >
                    <button className="text-blue-200"> View Media</button>
                  </a>
                  )
                </div>
              )}

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
          onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send message on Enter key
          placeholder="Type a message"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white p-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
