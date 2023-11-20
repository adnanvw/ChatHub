import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useSelector } from "react-redux";
import ChatPage from "./Pages/ChatPage";

export default function AllRoutes() {
  const auth = useSelector((state) => state.authReducer.isAuthenticated);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat" element={auth ? <ChatPage /> : <Navigate to="/" />} />
    </Routes>
  );
}
