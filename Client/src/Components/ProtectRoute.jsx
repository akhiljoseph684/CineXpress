import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import API from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    API.get("/auth/me", {
      withCredentials: true
    })
    .then(() => {
      setIsAuth(true);
      setLoading(false);
    })
    .catch(() => {
      setIsAuth(false);
      setLoading(false);
    });
  }, []);

  if (loading) return <div></div>;

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;