import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AlertBannerComponent from "../../components/AlertBannerComponent";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useAuthStore } from "../../stores/authStore";

import DocumentTitle from "../../components/DocumentTitle";

const ALERT_AUTO_CLOSE_MS = 3000;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerCashier, isSubmitting, error, clearError } = useAuthStore(
    useShallow((state) => ({
      registerCashier: state.registerCashier,
      isSubmitting: state.isSubmitting,
      error: state.error,
      clearError: state.clearError,
    })),
  );
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [dismissedAlertKey, setDismissedAlertKey] = useState("");

  const activeAlert = useMemo(() => {
    if (!error) {
      return null;
    }

    return {
      key: `error:${error}`,
      message: error,
      variant: "error",
      source: "error",
    };
  }, [error]);

  const visibleAlert =
    activeAlert && activeAlert.key !== dismissedAlertKey ? activeAlert : null;

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
    }, ALERT_AUTO_CLOSE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeAlert, dismissAlert]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Password confirmation does not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const response = await registerCashier({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", {
        replace: true,
        state: {
          message:
            response.message ??
            "Account created successfully. Please wait for admin activation before logging in.",
        },
      });
    } catch {
      return null;
    }

    return null;
  };

  return (
    <AuthPageShell>
      <DocumentTitle title="Register Akun Kasir" />
      <LoginCardComponent subtitle="Create Your Account Here">
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
            id="username"
            type="text"
            label="Username"
            placeholder="Username"
            value={form.username}
            onChange={(event) => handleChange("username", event.target.value)}
            error={fieldErrors.username}
          />
          <DefaultInputComponent
            id="email"
            type="email"
            label="Email"
            placeholder="cashier@example.com"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            error={fieldErrors.email}
          />
          <DefaultInputComponent
            id="password"
            type="password"
            label="Password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            error={fieldErrors.password}
          />
          <DefaultInputComponent
            id="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(event) => handleChange("confirmPassword", event.target.value)}
            error={fieldErrors.confirmPassword}
          />

          <PrimaryButtonComponent type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </PrimaryButtonComponent>
        </form>

        <p className="mt-5 pb-6 text-center text-base text-[#919191] md:text-[17px]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#3572EF] hover:text-[#1255DE]">
            Login
          </Link>
        </p>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default RegisterPage;
