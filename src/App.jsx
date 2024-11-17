import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./components/pages/home/home-page";
import DonateBloodPage from "./components/pages/donate-blood/donate-blood-page";
import HostBloodDrivePage from "./components/pages/host-blood-drive/host-blood-drive";
import NeedBloodPage from "./components/pages/need-blood/need-blood-page";
import ContactPage from "./components/pages/contact/contact-page";
import Admin from "./components/layouts/admin";
import Login from "./components/pages/auth/login";
import Signup from "./components/pages/auth/signup";
import MyAccount from "./components/pages/account/my-account";

import Dashboard from "../src/components/views/admin/dashboard";
import AdminDonateBlood from "../src/components/views/admin/admin-donate-blood";
import AdminNeedBlood from "../src/components/views/admin/admin-need-blood";
import AdminHostBloodDrive from "../src/components/views/admin/admin-host-blood-drive";
import AdminNeedHelp from "../src/components/views/admin/admin-need-help";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/my-account" element={<MyAccount />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host-blood-drive"
        element={
          <ProtectedRoute>
            <HostBloodDrivePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate-blood"
        element={
          <ProtectedRoute>
            <DonateBloodPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/need-blood"
        element={
          <ProtectedRoute>
            <NeedBloodPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="donate-blood" element={<AdminDonateBlood />} />
        <Route path="need-blood" element={<AdminNeedBlood />} />
        <Route path="host-blood-drive" element={<AdminHostBloodDrive />} />
        <Route path="need-help" element={<AdminNeedHelp />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}