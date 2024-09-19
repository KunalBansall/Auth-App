import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedin, setIslogged] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) {
    //   setIslogged(true);
    // }
    // if (!token) {
    //   setIslogged(false);
    // }
    setIslogged(!!token)
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    setIslogged(false);
    navigate("/sign-in");
  };
  return (
    <header className="bg-blue-300 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
          <h1
            className="font-bold text-center text-orange-700  flex items-center bg-slate-300
           rounded-lg p-1 outline"
          >
            Auth-App
          </h1>
        </Link>

        <Link to={"/"}>
          <h2 className="font-bold ">Home</h2>
        </Link>

        {isLoggedin ? (
          <button
            onClick={handleSignout}
            className="font-bold bg-red-400 text-white py-2 px-4 rounded-lg"
          >
            {" "}
            Sign out
          </button>
        ) : (
          <Link to={"/sign-in"}>
            <h2 className="font-bold bg-red-400 text-white py-2 px-4 rounded-lg">
              Sign-in
            </h2>
          </Link>
        )}
      </div>
    </header>
  );
}
