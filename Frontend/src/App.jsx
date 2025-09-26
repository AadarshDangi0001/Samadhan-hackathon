// src/App.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Mainroutes from "./routes/Mainroutes.jsx";
import "./App.css";
import { useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const { loading } = useAuth();

  const hideNavRoutes = ["/login", "/signup"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname.toLowerCase());

  // ✅ Wait until auth check is done
  if (loading) return null; // or a spinner

  return (
    <div className="app-layout">
      {!shouldHideNav && <Nav />}
      <Mainroutes />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 300000 }}
      />
    </div>
  );
};

export default App;
