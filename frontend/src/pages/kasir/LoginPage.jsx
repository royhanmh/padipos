import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AlertBannerComponent from "../../components/AlertBannerComponent";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { getHomePathForRole, useAuthStore } from "../../stores/authStore";

import DocumentTitle from "../../components/DocumentTitle";

const LOGIN_REQUIRED_MESSAGE = "Anda harus login terlebih dahulu";
const LOGIN_ALERT_AUTO_CLOSE_MS = 3000;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginCashier, isSubmitting, error, clearError } = useAuthStore(
    useShallow((state) => ({
      loginCashier: state.loginCashier,
      isSubmitting: state.isSubmitting,
      error: state.error,
      clearError: state.clearError,
    })),
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const routeMessage = location.state?.message ?? "";
  const [dismissedAlertKey, setDismissedAlertKey] = useState("");

  const activeAlert = useMemo(() => {
    if (error) {
      return {
        key: `error:${error}`,
        message: error,
        variant: "error",
        source: "error",
      };
    }

    if (routeMessage === LOGIN_REQUIRED_MESSAGE) {
      return {
        key: `route:${routeMessage}`,
        message: routeMessage,
        variant: "error",
        source: "route",
      };
    }

    if (routeMessage) {
      return {
        key: `route:${routeMessage}`,
        message: routeMessage,
        variant: "success",
        source: "route",
      };
    }

    return null;
  }, [error, routeMessage]);

  const visibleAlert =
    activeAlert && activeAlert.key !== dismissedAlertKey ? activeAlert : null;

  const nextPath = useMemo(() => {
    const requestedPath = location.state?.from?.pathname;
    return requestedPath && requestedPath.startsWith("/kasir")
      ? requestedPath
      : getHomePathForRole("cashier");
  }, [location.state]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    clearError();
  };

  const dismissAlert = useCallback((alert) => {
    if (!alert) {
      return;
    }

    setDismissedAlertKey(alert.key);

    if (alert.source === "error") {
      clearError();
    }
  }, [clearError]);

  useEffect(() => {
    if (!activeAlert) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      dismissAlert(activeAlert);
    }, LOGIN_ALERT_AUTO_CLOSE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeAlert, dismissAlert]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const response = await loginCashier({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(nextPath, { replace: true });
      return response;
    } catch {
      return null;
    }
  };

  return (
    <AuthPageShell>
      <DocumentTitle title="Login Kasir" />
      <LoginCardComponent>
        {visibleAlert ? (
          <AlertBannerComponent
            message={visibleAlert.message}
            variant={visibleAlert.variant}
            authSuccessStyle={visibleAlert.variant === "success"}
            isAuthLayout
            className="mb-4"
            onDismiss={() => dismissAlert(visibleAlert)}
          />
        ) : null}

        <form onSubmit={handleSubmit}>
          <DefaultInputComponent
            id="email"
            type="email"
            placeholder="cashier@example.com"
            label="Email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            error={fieldErrors.email}
          />
          <DefaultInputComponent
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            error={fieldErrors.password}
            helpText={
              <Link
                to="/reset"
                className="text-base text-[#919191] hover:text-[#5E5E5E] md:text-[17px]"
              >
                Forget password?
              </Link>
            }
            helpTextClassName="mt-2.5 text-right md:mt-3"
          />

          <PrimaryButtonComponent type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </PrimaryButtonComponent>
        </form>

        <p className="mt-5 pb-6 text-center text-base text-[#919191] md:text-[17px]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#3572EF] hover:text-[#1255DE]">
            Register
          </Link>
        </p>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default LoginPage;
