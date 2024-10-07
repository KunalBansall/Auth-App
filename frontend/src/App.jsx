import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import Header from "./components/Header";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/Chat";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/" element={<ProtectedRoute element={<Home/>}/>} />
        <Route path="/chat/:userId" element={<Chat/>} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} /> {/* Protect the Profile route */}
     
      </Routes>
    </Router>
  );
}

export default App;
