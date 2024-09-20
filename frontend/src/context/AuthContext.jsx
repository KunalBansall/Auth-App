import React, { Children, createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const defaultAvatarUrl =
  "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // Default avatar

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [avatar, setAvatar] = useState("");

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const storedAvatar = localStorage.getItem('avatar');
    if(token){
      setIsAuthenticated(true);
      setAvatar(storedAvatar||defaultAvatarUrl);
    }
  },[])

  const login = (token, avatar) => {
    localStorage.setItem("token", token);
    localStorage.setItem("avatar", avatar || defaultAvatarUrl);
    setIsAuthenticated(true);
    setAvatar(avatar || defaultAvatarUrl);
  };
  const logout = (token, avatar) => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    setIsAuthenticated(false);
    setAvatar("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, avatar, logout }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
