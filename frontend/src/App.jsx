import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
