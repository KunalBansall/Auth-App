import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedin, setIslogged] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const defaultAvatarUrl = 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png'; // A placeholder image

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAvatarUrl = localStorage.getItem("avatar"); // Getting the stored avatar URL

    setIslogged(!!token);
    setAvatarUrl(storedAvatarUrl || defaultAvatarUrl); // Use a default avatar URL
  }, []);

  const handleSignout = () => {
    const confirmSignout = window.confirm('Are you sure you want to sign out ?')
    if(confirmSignout){
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    setIslogged(false);
    setAvatarUrl('');
    navigate("/sign-in");
    }
  };

  return (
    <header className="bg-blue-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4 ">
        {/* Left - App Name */}
        <Link to="/">
          <h1 className="font-bold text-orange-700 bg-slate-300 rounded-lg p-2 hover:underline outline">
            Auth-App
          </h1>
        </Link>

        {/* Center - Navigation */}
        <div className="flex gap-6 hover:underline">
          <Link to="/">
            <h2 className="font-bold ">Home</h2>
          </Link>
          {/* You can add more links here if needed */}
        </div>

        {/* Right - Sign Out Button & Avatar */}
        <div className="flex items-center gap-4 ">
          {isLoggedin && 
          <Link to={'/profile'}>
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          </Link>
          }
          {!isLoggedin &&(

            <Link to={'/sign-in'}>
            <button
         
            className="font-bold bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition"
          >
            Sign in
          </button>
          </Link>
        ) 
          
          }
        </div>
      </div>
    </header>
  );
}
