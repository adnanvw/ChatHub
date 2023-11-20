import React from "react";
import AllRoutes from "./AllRoutes";
import "./CSS/app.model.css";
import logo from "./Images/Background.jpg";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <div
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "100% 100vh",
        width: "100%",
        height: "100vh",
      }}

    >
      <AllRoutes />
      <ToastContainer />
    </div>
  );
}

