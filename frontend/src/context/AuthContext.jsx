import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; // Make sure to install axios if you haven't
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
const defaultAvatarUrl =
  "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // Default avatar
// const API_URL = "http://localhost:5000";
const API_URL = "https://auth-app-main-4bam.onrender.com" ;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    const token = sessionStorage.getItem("token"); // Change to sessionStorage

    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = (token) => {
    axios
      .get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const decodedToken = jwtDecode(token);
        const tokenUserId = decodedToken.userId;
        const currentUser = response.data.find((u) => u._id === tokenUserId);

        if (currentUser) {
          setIsAuthenticated(true);
          setUser({
            ...currentUser,
            avatar: currentUser.avatar || defaultAvatarUrl,
          });
        } else {
          console.warn("No user found with the given token ID after login.");
          logout();
        }
      })
      .catch((error) => {
        console.error("Error fetching user data after login:", error);
        // logout();
      });
  };

  const login = (token, avatar, username, id) => {
    // localStorage.setItem("token", token);
    sessionStorage.setItem("token", token); // Change to sessionStorage

    console.log("username", username, "avaatr", avatar, id);
    setIsAuthenticated(true);
    const currentUser = {
      username,
      avatar,
      id,
    };
    // console.log(currentUser , "helo");

    sessionStorage.setItem("user", JSON.stringify(currentUser)); // Change to sessionStorage
    setUser(currentUser); // Set user state
    // localStorage.setItem("user", JSON.stringify(currentUser));
    console.log(currentUser);
  };
  const logout = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    sessionStorage.removeItem("token"); // Change to sessionStorage
    sessionStorage.removeItem("user"); // Change to sessionStorage
    setIsAuthenticated(false);
    setUser(null); // Clear user on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
