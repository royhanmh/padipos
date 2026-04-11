import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AuthPageShell from "../../components/AuthPageShell";
import AlertBannerComponent from "../../components/AlertBannerComponent";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import DocumentTitle from "../../components/DocumentTitle";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { useAuthStore } from "../../stores/authStore";

const ALERT_AUTO_CLOSE_MS = 3000;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? "";
  const { resetCashierPassword, isSubmitting, error, clearError } = useAuthStore(
    useShallow((state) => ({
      resetCashierPassword: state.resetCashierPassword,
      isSubmitting: state.isSubmitting,
      error: state.error,
      clearError: state.clearError,
    })),
  );
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
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

    if (successMessage) {
      return {
        key: `success:${successMessage}`,
        message: successMessage,
        variant: "success",
        source: "success",
      };
    }

    return null;
  }, [error, successMessage]);

  const visibleAlert =
    activeAlert && activeAlert.key !== dismissedAlertKey ? activeAlert : null;

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (!email) {
      navigate("/reset", { replace: true });
    }
  }, [email, navigate]);

  const dismissAlert = (alert) => {
    if (!alert) {
      return;
    }

    setDismissedAlertKey(alert.key);

    if (alert.source === "error") {
      clearError();
    }
  };

  useEffect(() => {
    if (!activeAlert) {
      setDismissedAlertKey("");
      return undefined;
    }

    setDismissedAlertKey((current) =>
      current.startsWith(`${activeAlert.source}:`) && current !== activeAlert.key
        ? ""
        : current,
    );

    const timeoutId = window.setTimeout(() => {
      dismissAlert(activeAlert);
    }, ALERT_AUTO_CLOSE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeAlert]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [field]: "",
    }));
    clearError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!form.newPassword.trim()) {
      nextErrors.newPassword = "New password is required.";
    } else if (!strongPasswordPattern.test(form.newPassword)) {
      nextErrors.newPassword =
        "Use at least 8 characters with letters and numbers.";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm new password is required.";
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = "Password confirmation does not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      const response = await resetCashierPassword({
        email,
        new_password: form.newPassword,
      });
      setSuccessMessage(
        response?.message ?? "Your password has been successfully reset.",
      );
      clearError();
    } catch {
      // Store error is rendered below.
    }
  };

  return (
    <AuthPageShell>
      <DocumentTitle title="Reset Password" />
      <LoginCardComponent
        title="Reset Password"
        subtitle="Please enter your new password and confirm!"
        className="pb-24 max-lg:pb-20"
      >
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

        {successMessage ? (
          <div>
            <p className="mb-5 text-sm text-[#5E5E5E] md:text-base">
              Your cashier password has been updated. Continue to login with your
              new password.
            </p>
            <Link to="/login" className="block">
              <PrimaryButtonComponent type="button">
                Log in with new password
              </PrimaryButtonComponent>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DefaultInputComponent
              id="new-password"
              type="password"
              label="New Password"
              placeholder="Enter a new password"
              value={form.newPassword}
              onChange={(event) => handleChange("newPassword", event.target.value)}
              error={fieldErrors.newPassword}
              helpText="Use at least 8 characters with letters and numbers."
            />
            <DefaultInputComponent
              id="confirm-password"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={form.confirmPassword}
              onChange={(event) =>
                handleChange("confirmPassword", event.target.value)
              }
              error={fieldErrors.confirmPassword}
            />

            <PrimaryButtonComponent type="submit" className="mt-3" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </PrimaryButtonComponent>
          </form>
        )}
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default ResetPasswordPage;
