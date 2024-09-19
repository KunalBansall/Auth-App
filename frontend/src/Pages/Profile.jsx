import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignout = () => {
    const ConfirmSignout = window.confirm("Are you sure you wanna sign out?");
    if (ConfirmSignout) {
      logout();
      // Redirect to the sign-in page
      navigate("/sign-in");
    }
  };

  return (
    <div className="bg-gray-400 flex items-center justify-center min-h-screen">
      <div className="bg-gray-600">
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </div>
  );
}
