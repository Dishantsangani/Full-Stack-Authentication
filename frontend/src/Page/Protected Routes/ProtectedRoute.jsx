import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5500/api/main/home", {
        withCredentials: true, // 🔥 required to send cookie
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  // Still checking
  if (isAuthenticated === null) {
    return <p>Redirecting...</p>;
  }

  // Not authenticated → redirect
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Authenticated → render protected page
  return children;
}

export default ProtectedRoute;
