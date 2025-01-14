import { useEffect, useState } from "react";
import { authToken } from "./Auth";
import { Navigate } from "react-router-dom";
// import Loder from "../src/components/Loder";
import Loder2 from "../src/components/Loder2";

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await authToken();
      setIsAuthenticated(isValid.valid);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <Loder2/>;
  }

  return isAuthenticated ? <Navigate to="/create" replace /> : children;
};

export default PublicRoute;
