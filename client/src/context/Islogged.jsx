import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Islogged = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/create-post" />;
  }
  return children;
};

export default Islogged;
