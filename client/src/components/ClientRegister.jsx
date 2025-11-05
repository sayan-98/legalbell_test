import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./ClientRegister.css";

const ClientRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    photo: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    try {
      await axios.post("http://localhost:5000/api/client/register", formData);

      localStorage.setItem("clientName", form.name);
      if (form.photo) {
        const photoURL = URL.createObjectURL(form.photo);
        localStorage.setItem("clientPhoto", photoURL);
      }

      alert("Client registered successfully");
      navigate("/client-login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="client-register-page">
      <div className="client-register-card">
        <h2 className="client-register-title">Client Registration</h2>
        <form onSubmit={handleSubmit} className="client-register-form">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="client-register-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="client-register-input"
          />
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="client-register-input"
          />
          <input
            name="dob"
            type="date"
            onChange={handleChange}
            required
            className="client-register-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
            className="client-register-input"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="client-register-input file-input"
          />
          <button type="submit" className="client-register-btn">
            Register
          </button>
          <p className="client-register-text">
                      Already have an account?{" "}
                      <Link to="/client-login" className="client-register-link">
                        Login Here
                      </Link>
                    </p>
        </form>
      </div>
    </div>
  );
};

export default ClientRegister;
