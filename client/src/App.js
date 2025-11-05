import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ClientRegister from "./components/ClientRegister";
import ClientLogin from "./components/ClientLogin";
import LawyerRegister from "./components/LawyerRegister";
import LawyerLogin from "./components/LawerLogin";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => (
  <Router>
    {/* ✅ Navbar should always be visible for showing Back button */}
    <Navbar />

    <Routes>
      {/* Redirect root to LandingPage */}
      <Route path="/" element={<Navigate to="/landingPage" replace />} />

      {/* Public routes */}
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path="/client-register" element={<ClientRegister />} />
      <Route path="/client-login" element={<ClientLogin />} />
      <Route path="/lawyer-register" element={<LawyerRegister />} />
      <Route path="/lawyer-login" element={<LawyerLogin />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
