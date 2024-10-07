import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"; // Make sure to install axios if you haven't
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
const defaultAvatarUrl =
  "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // Default avatar

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = (token) => {
    axios
      .get("http://localhost:5000/api/users", {
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
        }
      })
      .catch((error) => {
        console.error("Error fetching user data after login:", error);
        logout();
      });
  };

  const login = (token, avatar) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchUserData(token);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null); // Clear user on logout
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login,  logout, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
