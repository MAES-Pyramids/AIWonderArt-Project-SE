import React from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { logo } from "./assets";
import { Home, CreatePost } from "./pages";
import RequireAuth from "./context/Require";
import AuthProvider from "./context/AuthContext";
import Islogged from "./context/Islogged";
import LogIn from "./authentication/Login";
import SignUp from "./authentication/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>

        <Link
          to="/create-post"
          className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md"
        >
          Create
        </Link>
      </header>

      <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <Islogged>
                  <LogIn />
                </Islogged>
              }
            />
            <Route
              path="/signup"
              element={
                <Islogged>
                  <SignUp />
                </Islogged>
              }
            />
            <Route path="/" element={<Home />} />
            <Route
              path="/create-post"
              element={
                <RequireAuth>
                  <CreatePost />
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </main>
    </BrowserRouter>
  );
};

export default App;
