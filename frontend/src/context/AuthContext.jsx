import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; // Make sure to install axios if you haven't
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();
const defaultAvatarUrl = "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // Default avatar

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedAvatar = localStorage.getItem('avatar');
    if (token) {
      // Decode the token to get user ID
      const decodedToken = jwtDecode(token);
      // console.log("Decoded token:", decodedToken); // Debug log

      const tokenUserId = decodedToken.userId; // Ensure this matches your token structure

      // Fetch all users data using the token
      axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Assuming response.data is an array of users
        const currentUser = response.data.find(u => u._id === tokenUserId);
        // console.log("Current user fetched:", currentUser); // Debug log


        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser); // Set the current user data
          // console.log("user" ,user);
          console.log("Current user fetched:", currentUser._id); // Debug log
          setAvatar(storedAvatar || defaultAvatarUrl);
        } else {
          console.warn("No user found with the given token ID.");
        }
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        // Optionally handle error (e.g., logout the user)
      });
    }
  }, []);

  const login = (token, avatar) => {
    localStorage.setItem("token", token);
    localStorage.setItem("avatar", avatar || defaultAvatarUrl);
    setIsAuthenticated(true);
    setAvatar(avatar || defaultAvatarUrl);

    // Fetch user data after login
    fetchUserData(token);
    setUser(currentUser);
  };

  const fetchUserData = (token) => {
    axios.get("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      const decodedToken = jwtDecode(token);
      const tokenUserId = decodedToken._id; // Ensure this matches your token structure

      const currentUser = response.data.find(u => u._id === tokenUserId);
      if (currentUser) {
        setUser(currentUser);
        console.log("User logged in:", currentUser); // Debug log
      } else {
        console.warn("No user found with the given token ID after login.");
      }
    })
    .catch(error => {
      console.error("Error fetching user data after login:", error);
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    setIsAuthenticated(false);
    setAvatar("");
    setUser(null); // Clear user on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, avatar, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};