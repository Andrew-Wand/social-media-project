import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import CreateComment from "./pages/CreateComment";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <Navbar loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main/:userId" element={<Home loggedIn={loggedIn} />} />
        <Route path="/sign-in" element={<SignIn setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-comment/:id" element={<CreateComment />} />
      </Routes>
    </div>
  );
}

export default App;
