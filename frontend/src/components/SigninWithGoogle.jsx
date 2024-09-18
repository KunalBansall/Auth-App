import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth, provider } from '../firebase.js'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const SignInWithGoogle = () => {
    const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user); // You can use this user info as needed

      // Show success toast
      toast.success("Google Sign-In Successful!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
     
        setTimeout(()=> navigate('/'),3000);
        
      
      // Redirect or do something with the signed-in user info

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
    <button onClick={handleGoogleSignIn} className="w-full py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold transition duration-300">
      Sign In with Google
    </button>
  );
};

export default SignInWithGoogle;
