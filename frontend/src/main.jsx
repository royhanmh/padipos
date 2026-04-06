import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/kasir/LoginPage.jsx";
import RegisterPage from "./pages/kasir/RegisterPage.jsx";
import RequestResetPasswordPage from "./pages/kasir/RequestResetPasswordPage.jsx";
import ResetPasswordPage from "./pages/kasir/ResetPasswordPage.jsx";
import KasirCatalogPage from "./pages/kasir/KasirCatalogPage.jsx";
import KasirSalesReportPage from "./pages/kasir/KasirSalesReportPage.jsx";
import KasirSettingsPage from "./pages/kasir/KasirSettingsPage.jsx";
import DashboardLoginPage from "./pages/dashboard/DashboardLoginPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import CatalogPage from "./pages/dashboard/CatalogPage.jsx";
import SalesReportPage from "./pages/dashboard/SalesReportPage.jsx";
import SettingsPage from "./pages/dashboard/SettingsPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset" element={<RequestResetPasswordPage />} />
      <Route path="reset/form" element={<ResetPasswordPage />} />
      <Route path="kasir" element={<Navigate to="/kasir/catalog" replace />} />
      <Route path="kasir/catalog" element={<KasirCatalogPage />} />
      <Route path="kasir/sales-report" element={<KasirSalesReportPage />} />
      <Route path="kasir/settings" element={<KasirSettingsPage />} />
      <Route path="dashboard/login" element={<DashboardLoginPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="dashboard/catalog" element={<CatalogPage />} />
      <Route path="dashboard/sales-report" element={<SalesReportPage />} />
      <Route path="dashboard/settings" element={<SettingsPage />} />
    </Routes>
  </BrowserRouter>,
);
