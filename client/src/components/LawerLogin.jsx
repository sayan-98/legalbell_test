import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LawyerLogin.css";

const LawyerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/lawyer/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "lawyer");
      alert("✅ Login Successful");
      navigate("/home");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login Failed"));
    }
  };

  return (
    <div className="lawyer-login-page">
      <div className="lawyer-login-card">
        <h2 className="lawyer-login-title">Lawyer Login</h2>
        <form onSubmit={handleLogin} className="lawyer-login-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="lawyer-login-input"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="lawyer-login-input"
          />
          <button type="submit" className="lawyer-login-btn">
            Login
          </button>
        </form>
        <p className="lawyer-register-text">
          Don’t have an account?{" "}
          <Link to="/lawyer-register" className="lawyer-register-link">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LawyerLogin;
