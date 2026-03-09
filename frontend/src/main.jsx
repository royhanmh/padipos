import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/kasir/LoginPage.jsx";
import RegisterPage from "./pages/kasir/RegisterPage.jsx";
import RequestResetPasswordPage from "./pages/kasir/RequestResetPasswordPage.jsx";
import ResetPasswordPage from "./pages/kasir/ResetPasswordPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset" element={<RequestResetPasswordPage />} />
      <Route path="reset/form" element={<ResetPasswordPage />} />
    </Routes>
  </BrowserRouter>,
);
