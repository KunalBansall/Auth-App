import React from "react";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, provider } from "../firebase.js"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const API_URL = "https://auth-app-main-4bam.onrender.com/auth";
// const API_URL = "http://localhost:5000/auth" ;

const SignInWithGoogle = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Get the user's token and store it
        const token = await user.getIdToken();

        const email = user.email;
        const username = user.displayName;

        // Store the user's avatar URL in local storage
        const avatar =
          user.photoURL ||
          "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"; // Use correct property name

        const res = await axios.post(`${API_URL}/google-signin`, {
          email,
          avatar,
          username,
        });

        login(res.data.token, res.data.user);
        sessionStorage.setItem("token", res.data.token);

        toast.success("Google Sign-In Successful!", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast.error("Google Sign-In Failed! Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition duration-300"
    >
      Sign In with Google
    </button>
  );
};

export default SignInWithGoogle;
