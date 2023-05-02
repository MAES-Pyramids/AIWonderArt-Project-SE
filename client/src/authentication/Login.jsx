import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "bootstrap";

const LogIn = () => {
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const protectPath = location.state?.path || "/login" || "/signup  ";
  const redirectPath = location.state?.path || "/create-post";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate(redirectPath, { replace: true });
      navigate(protectPath, { replace: true });
    } catch {
      setError("Failed to login");
    }
  };
  return (
    <div>
      <form
        className="vh-100"
        style={{ backgroundColor: "#508bfc" }}
        onSubmit={handleSubmit}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card shadow-2-strong"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5 text-center">
                  <h3 className="mb-5">Log In</h3>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      ref={emailRef}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      ref={passwordRef}
                    />
                  </div>

                  <button
                    className="btn btn-primary btn-lg btn-block w-100 "
                    type="submit"
                    disabled={loading}
                  >
                    Login
                  </button>

                  <hr className="my-4" />
                  <div>
                    <Link to="/forgetpassword"> Forget Password</Link>
                  </div>
                </div>
              </div>
              <p style={{ color: "white" }}>
                I don't have an account{" "}
                <Link style={{ color: "black" }} to={"/SignUp"}>
                  sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
