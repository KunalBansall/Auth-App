import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout, user: ContextUser } = useAuth();
  const [ user , setuser]= useState("");

  // Log user object for debugging
  // console.log(user);

useEffect(()=>{
  const storedUser = sessionStorage.getItem('user');
  if(storedUser){
    setuser(JSON.parse(storedUser))
    // console.log("user", user );
    // console.log("user avatar", user.avatar );
  }
} ,[]);


// console.log( "user",user, "user.avatar", user.avatar, "context",ContextUser,"avatr context" , ContextUser.avatar);



  const handleSignout = () => {
    const ConfirmSignout = window.confirm("Are you sure you wanna sign out?");
    if (ConfirmSignout) {
      logout();

      navigate("/sign-in");
    }
  };

  return (
    <div className="bg-gray-400 flex items-center justify-center min-h-screen">
      <div>
        {/* Render username */}
        <h1>{user && user.username ? user.username : "User"}</h1>

        {/* Render avatar if available */}
        <img 
          src={ContextUser && ContextUser.avatar ? ContextUser.avatar : "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"} 
          alt="User Avatar"
          className="rounded-full w-32 h-32 mt-4"
        />
      </div>

      <div className="bg-gray-600 mt-4">
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </div>
  );
}