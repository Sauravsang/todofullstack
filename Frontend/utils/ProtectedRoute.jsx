import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authToken } from "./Auth";
// import Loder from "../src/components/Loder";
import Loder2 from "../src/components/Loder2";


const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await authToken();
      setIsAuthenticated(isValid.valid);
    };
    checkAuth();
  }, []);

  // Show a loading state while verifying the token
  if (isAuthenticated === null) {
    return <Loder2/>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;
