// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  // Wait until auth check is done
  if (loading) return null; // or a spinner

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please login to use features");
      const timer = setTimeout(() => {
        setRedirect(true); // trigger redirect after delay
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && redirect) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated → render children
  if (isAuthenticated) return children;

  // Otherwise show nothing until redirect
  return null;
};

export default PrivateRoute;
