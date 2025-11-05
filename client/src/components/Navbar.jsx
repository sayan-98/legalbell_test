import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBackward } from "react-icons/fa";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({ name: "", photo: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const role = localStorage.getItem("role");
          const endpoint = role === "lawyer"
            ? "http://localhost:5000/api/lawyer/profile"
            : "http://localhost:5000/api/client/profile";
          const res = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    alert("You have been logged out.");
    navigate("/landingPage");
  };

  // ✅ Show "Back" button on all login/register pages
  const showBackButton = [
    "/client-login",
    "/client-register",
    "/lawyer-login",
    "/lawyer-register",
  ].includes(location.pathname);

  return (
    <nav className="navbar">
      {/* Left side - App name */}
      <div className="nav-left">
        <h1>LegalBell</h1>
      </div>

      {/* Center links (only after login) */}
      <div className="nav-center">
        {token && (
          <>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {/* Right side - user info or back button */}
      <div className="nav-right">
        {token && user.name ? (
          <div className="user-info">
            <span className="greet">Hello Mr. {user.name}</span>
            {user.photo && (
              <img
                src={`http://localhost:5000/uploads/${user.photo}`}
                alt="Profile"
                className="user-photo"
              />
            )}
          </div>
        ) : null}

        {/* ✅ Show back button on login/register pages */}
        {showBackButton && (
          <button className="back-btn" onClick={() => navigate("/landingPage")}>
            <FaBackward />
            &nbsp;Back to Landing Page
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
