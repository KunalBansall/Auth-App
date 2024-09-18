import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/sign-in", formData);
      localStorage.setItem("token", res.data.token);
      alert("Login Success");
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Sign In
        </h1>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-orange-600 hover:bg-orange-700 text-white font-bold transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Don't have an account?
            <a href="/sign-up" className="text-orange-500 hover:underline ml-1">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
