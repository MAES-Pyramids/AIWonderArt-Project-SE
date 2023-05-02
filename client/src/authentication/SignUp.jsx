import { Link, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Alert } from "bootstrap";

const SignUp = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const passordConfirmationRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value !== passordConfirmationRef.current.value) {
      return setError("Password is NOT match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(
        nameRef.current.value,
        emailRef.current.value,
        passwordRef.current.value,
        passordConfirmationRef.current.value
      );
      navigate("/create-post");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
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
                  <h3 className="mb-5">Sign up</h3>
                  {error && <span variant="danger">{error}</span>}

                  <div className="form-outline mb-4">
                    <input
                      type="name"
                      id="name"
                      className="form-control form-control-lg"
                      placeholder="Name"
                      ref={nameRef}
                      required
                    />
                  </div>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      ref={emailRef}
                      required
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="password-confirm"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      ref={passwordRef}
                      required
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm Password"
                      ref={passordConfirmationRef}
                      required
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-lg btn-block w-100 "
                    type="submit"
                    disabled={loading}
                  >
                    Signup
                  </button>

                  <hr className="my-4" />
                  <p>
                    I Already have an account<Link to={"/LogIn"}>Log in</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
