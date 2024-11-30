import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/validate-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setIsValid(response.ok);
      } catch (error) {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <div>Cargando...</div>;
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
