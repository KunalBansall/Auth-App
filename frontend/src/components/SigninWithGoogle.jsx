import React from "react";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, provider } from "../firebase.js"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";

const SignInWithGoogle = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the user's token and store it
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      // Store the user's avatar URL in local storage
      const avatar = user.photoURL; // Use correct property name
      console.log(avatar);
      localStorage.setItem("avatar", avatar);

      toast.success("Google Sign-In Successful!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => navigate("/"), 3000);
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