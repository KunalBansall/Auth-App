import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);

    
  // const API_USER = 'http://localhost:5000';
  const API_URL = "https://auth-app-main-4bam.onrender.com" ;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user._id} className="flex items-center border p-4 rounded">
            <img
              src={user.avatar || "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-4"
            />
            <Link to={`/chat/${user._id}`} className="text-lg">
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;