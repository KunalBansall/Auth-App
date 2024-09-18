import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin"
import Home from "./Pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
