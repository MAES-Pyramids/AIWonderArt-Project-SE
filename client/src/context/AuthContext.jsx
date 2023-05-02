import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  const [token, setToken] = useState();

  const signUp = async (name, email, password, passwordConfirm) => {
    try {
      const response = await fetch(
        "https://aiwonderart.onrender.com/api/v1/Users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, passwordConfirm }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        const { user } = data.data;
        setUser(user);
        return data;
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://aiwonderart.onrender.com/api/v1/Users/login",
        data: {
          email,
          password,
        },
      });
      if (response.data.status === "success") {
        const { token } = response.data;
        setToken(token);
        const { user } = response.data.data;
        setUser(user);
        return response.data;
      }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
  return (
    <AuthContext.Provider value={{ user, signUp, login, token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
export const useAuth = () => {
  return useContext(AuthContext);
};
