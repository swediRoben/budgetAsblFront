import React from 'react';
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;