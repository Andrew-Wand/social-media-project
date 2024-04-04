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
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
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
