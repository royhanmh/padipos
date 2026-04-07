import { Navigate, Outlet, useLocation } from "react-router";
import { useShallow } from "zustand/react/shallow";
import {
  getHomePathForRole,
  getLoginPathForRole,
  useAuthStore,
} from "../stores/authStore";

const AuthRouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-6 text-center text-[#6A6A6A]">
    <p className="text-base">Loading session...</p>
  </div>
);

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
        state={{ from: location }}
      />
    );
  }

  if (role !== requiredRole) {
    return <Navigate to={getHomePathForRole(role)} replace />;
  }

  return <Outlet />;
};
