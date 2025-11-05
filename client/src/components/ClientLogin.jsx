import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./ClientLogin.css";

const ClientLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post("http://localhost:5000/api/client/login", form);
      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      const profileRes = await axios.get("http://localhost:5000/api/client/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { name, photo } = profileRes.data;
      localStorage.setItem("userName", name);
      localStorage.setItem("userPhoto", photo);

      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="client-login-page">
      <div className="client-login-card">
        <h2 className="client-login-title">Client Login</h2>
        <form onSubmit={handleSubmit} className="client-login-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="client-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
            className="client-input"
          />
          <button type="submit" className="client-login-btn">
            Login
          </button>
          <p className="client-register-text">
            Don’t have an account?{" "}
            <Link to="/client-register" className="client-register-link">
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;
