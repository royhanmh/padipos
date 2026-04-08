import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import AuthSessionBootstrap from "./components/AuthSessionBootstrap";
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
import { HomeRedirect, PublicOnlyRoute, RequireRole } from "./routes/guards.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthSessionBootstrap>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dashboard/login" element={<DashboardLoginPage />} />
        </Route>

        <Route path="reset" element={<RequestResetPasswordPage />} />
        <Route path="reset/form" element={<ResetPasswordPage />} />

        <Route element={<RequireRole role="cashier" />}>
          <Route path="kasir" element={<Navigate to="/kasir/catalog" replace />} />
          <Route path="kasir/catalog" element={<KasirCatalogPage />} />
          <Route path="kasir/sales-report" element={<KasirSalesReportPage />} />
          <Route path="kasir/settings" element={<KasirSettingsPage />} />
        </Route>

        <Route element={<RequireRole role="admin" />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dashboard/catalog" element={<CatalogPage />} />
          <Route path="dashboard/sales-report" element={<SalesReportPage />} />
          <Route path="dashboard/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthSessionBootstrap>
  </BrowserRouter>,
);
