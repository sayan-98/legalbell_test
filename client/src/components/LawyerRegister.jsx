import React, { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import "./LawyerRegister.css";

const LawyerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    expertise: "",
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
      await axios.post("http://localhost:5000/api/lawyer/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lawyer registered successfully");
      navigate("/lawyer-login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="lawyer-register-container">
      <div className="lawyer-register-card">
        <h2 className="lawyer-register-title">Lawyer Registration</h2>
        <form onSubmit={handleSubmit} className="lawyer-register-form">
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input name="dob" type="date" onChange={handleChange} required />
          <input name="address" placeholder="Address" onChange={handleChange} required />

          <select name="expertise" value={form.expertise} onChange={handleChange} required>
            <option value="">Select Area of Expertise</option>
            <option value="Criminal">Criminal Law</option>
            <option value="Civil">Civil Law</option>
            <option value="Corporate">Corporate Law</option>
            <option value="Family">Family Law</option>
            <option value="Property">Property Law</option>
            <option value="Labour">Labour Law</option>
            <option value="Taxation">Taxation Law</option>
            <option value="Cyber">Cyber Law</option>
          </select>

          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          <button type="submit">Register</button>
          <p className="lawyer-register-text">
          Already have an account?{" "}
          <Link to="/lawyer-login" className="lawyer-register-link">
            Login Here
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
};

export default LawyerRegister;
