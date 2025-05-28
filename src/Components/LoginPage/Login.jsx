import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { MdEmail } from "react-icons/md";
import fetch_logo from "../Assets/fetch-rewards.svg";
import "./Login.css";

export function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name, email }),
        }
      );

      if (res.ok) {
        navigate("/search");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <img src={fetch_logo} alt="Fetch Logo" className="fetch-logo" />
          <h2 className="login-title">Find a Life Long Friend</h2>

          <div className="input-group">
            <VscAccount className="input-icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <MdEmail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
