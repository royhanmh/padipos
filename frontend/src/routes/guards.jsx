import { Navigate, Outlet, useLocation } from "react-router";
import { useShallow } from "zustand/react/shallow";
import {
  getHomePathForRole,
  getLoginPathForRole,
  useAuthStore,
} from "../stores/authStore";

const AuthRouteFallback = () => null;
const LOGIN_REQUIRED_MESSAGE = "Anda harus login terlebih dahulu";

export const HomeRedirect = () => {
  const { isHydrated, isAuthenticated, role } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
      isAuthenticated: state.isAuthenticated,
      role: state.role,
    })),
  );

  if (!isHydrated) {
    return <AuthRouteFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePathForRole(role)} replace />;
};

export const PublicOnlyRoute = () => {
  const { isHydrated, isAuthenticated, role } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
      isAuthenticated: state.isAuthenticated,
      role: state.role,
    })),
  );

  if (!isHydrated) {
    return <AuthRouteFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return <Outlet />;
};

export const RequireRole = ({ role: requiredRole }) => {
  const location = useLocation();
  const { isHydrated, isAuthenticated, role } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
      isAuthenticated: state.isAuthenticated,
      role: state.role,
    })),
  );

  if (!isHydrated) {
    return <AuthRouteFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={getLoginPathForRole(requiredRole)}
        replace
        state={{
          from: location,
          message: LOGIN_REQUIRED_MESSAGE,
        }}
      />
    );
  }

  if (role !== requiredRole) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return <Outlet />;
};
