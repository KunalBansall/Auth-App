import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { toast, ToastContainer } from "react-toastify"; // Import toast functions
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
import SignInWithGoogle from "../components/SigninWithGoogle";

const API_URL = "https://auth-app-main-4bam.onrender.com/auth";
function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.email) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/sign-up`, formData);
      toast.success("User created successfully!", {
        // Success toast
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // navigate("/sign-in");
      setTimeout(() => navigate("/sign-in"), 2000); // Navigate to the sign-in page after successful signup
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user. Please try again.", {
        // Error toast
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-950">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              id="username"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              required
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              id="password"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="py-5">
          <SignInWithGoogle />
          </div>
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-orange-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
