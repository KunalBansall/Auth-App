import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, avatar } = useAuth();
  const [isLoggedin, setIslogged] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const defaultAvatarUrl =
    "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // A placeholder image

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAvatarUrl = localStorage.getItem("avatar"); // Getting the stored avatar URL

    setIslogged(!!token);
    setAvatarUrl(storedAvatarUrl || defaultAvatarUrl); // Use a default avatar URL
  }, [avatar]);

  const handleSignout = () => {
    const confirmSignout = window.confirm(
      "Are you sure you want to sign out ?"
    );
    if (confirmSignout) {
      localStorage.removeItem("token");
      localStorage.removeItem("avatar");
      setIslogged(false);
      setAvatarUrl("");
      navigate("/sign-in");
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-red-300 to-green-800  shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        {/* Left - App Name */}
        <Link to="/">
          <h1 className="font-bold text-white bg-slate-600 rounded-lg p-2 hover:underline outline">
            Auth-App
          </h1>
        </Link>

        {/* Center - Navigation */}
        <div className="flex gap-6 hover:underline">
          <Link to="/">
            <h2 className="font-bold text-slate-600">Home</h2>
          </Link>
          {/* Add more links here if needed */}
        </div>

        {/* Right - Sign Out Button & Avatar */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to={"/profile"}>
              <img
                src={avatar || avatarUrl}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            </Link>
          ) : (
            <Link to={"/sign-in"}>
              <button className="font-bold bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition outline ">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
