import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import AuthPageShell from "../../components/AuthPageShell";
import DefaultInputComponent from "../../components/DefaultInputComponent";
import LoginCardComponent from "../../components/LoginCardComponent";
import PrimaryButtonComponent from "../../components/PrimaryButtonComponent";
import { getHomePathForRole, useAuthStore } from "../../stores/authStore";

const DashboardLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, isSubmitting, error, clearError } = useAuthStore(
    useShallow((state) => ({
      loginAdmin: state.loginAdmin,
      isSubmitting: state.isSubmitting,
      error: state.error,
      clearError: state.clearError,
    })),
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const nextPath = useMemo(() => {
    const requestedPath = location.state?.from?.pathname;
    return requestedPath && requestedPath.startsWith("/dashboard")
      ? requestedPath
      : getHomePathForRole("admin");
  }, [location.state]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    clearError();
  };

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
      await loginAdmin({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(nextPath, { replace: true });
    } catch {
      return null;
    }

    return null;
  };

  return (
    <AuthPageShell>
      <LoginCardComponent>
        <form onSubmit={handleSubmit}>
          <DefaultInputComponent
            id="email"
            type="email"
            placeholder="admin@example.com"
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

          {error ? (
            <p className="mb-4 rounded-[10px] border border-[#FAD7DB] bg-[#FFF7F8] px-4 py-3 text-sm text-[#B42318] md:text-base">
              {error}
            </p>
          ) : null}

          <PrimaryButtonComponent type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </PrimaryButtonComponent>
        </form>
      </LoginCardComponent>
    </AuthPageShell>
  );
};

export default DashboardLoginPage;
