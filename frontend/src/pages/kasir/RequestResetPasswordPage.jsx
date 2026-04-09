import { useState } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AlertBannerComponent from "../../components/AlertBannerComponent";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import DocumentTitle from "../../components/DocumentTitle";
import { useAuthStore } from "../../stores/authStore";

const RequestResetPasswordPage = () => {
  const navigate = useNavigate();
  const { requestCashierPasswordReset, isSubmitting, error, clearError } = useAuthStore(
    useShallow((state) => ({
      requestCashierPasswordReset: state.requestCashierPasswordReset,
      isSubmitting: state.isSubmitting,
      error: state.error,
      clearError: state.clearError,
    })),
  );
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFieldError("Email is required.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      setFieldError("Enter a valid email address.");
      return;
    }

    try {
      await requestCashierPasswordReset({ email: trimmedEmail });
      navigate("/reset/form", {
        state: {
          email: trimmedEmail,
        },
      });
    } catch {
      // Store error is rendered below.
    }
  };

  const handleChange = (value) => {
    setEmail(value);
    setFieldError("");
    clearError();
  };

  return (
    <AuthPageShell>
      <DocumentTitle title="Request Reset Password" />
      <LoginCardComponent
        title="Reset Password"
        subtitle="Please enter your registered email here!"
        className="pb-24 max-lg:pb-20"
      >
        <form onSubmit={handleSubmit}>
          <DefaultInputComponent
            id="reset-email"
            type="email"
            placeholder="cashier@example.com"
            label="Email"
            value={email}
            onChange={(event) => handleChange(event.target.value)}
            error={fieldError}
          />
          {error ? (
            <AlertBannerComponent
              variant="error"
              message={error}
              className="mb-4"
            />
          ) : null}
          <PrimaryButtonComponent type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? "Checking..." : "Continue"}
          </PrimaryButtonComponent>
        </form>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default RequestResetPasswordPage;
