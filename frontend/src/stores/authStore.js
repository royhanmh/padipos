import { create } from "zustand";
import { requestApi } from "../lib/apiClient";

const normalizeUser = (user, fallbackRole = null) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    role: user.role ?? fallbackRole,
  };
};

const buildSessionState = ({ user = null } = {}) => ({
  user,
  role: user?.role ?? null,
  isAuthenticated: Boolean(user),
});

export const shouldLogoutForAuthError = (error) => {
  if (!error) {
    return false;
  }

  if (error.status === 401 || error.status === 404) {
    return true;
  }

  if (error.status === 403) {
    return /inactive|not active|activation/i.test(String(error.message ?? ""));
  }

  return false;
};

export const handleProtectedAuthError = (error) => {
  if (shouldLogoutForAuthError(error)) {
    useAuthStore.getState().clearSession();
  }

  return error;
};

export const getHomePathForRole = (role) => {
  if (role === "admin") {
    return "/dashboard";
  }

  return "/kasir/catalog";
};

export const getLoginPathForRole = (role) => {
  if (role === "admin") {
    return "/dashboard/login";
  }

  return "/login";
};

export const useAuthStore = create((set, get) => ({
  ...buildSessionState(),
  isHydrated: false,
  isSubmitting: false,
  error: "",
  clearError: () => set({ error: "" }),
  clearSession: () =>
    set({
      ...buildSessionState(),
      isHydrated: true,
      isSubmitting: false,
      error: "",
    }),
  setSession: (user) => {
    const normalizedUser = normalizeUser(user);

    set({
      ...buildSessionState({ user: normalizedUser }),
      isHydrated: true,
      error: "",
      isSubmitting: false,
    });
  },
  initializeAuth: async () => {
    try {
      const user = await requestApi("/auth/me");
      get().setSession(user);
      return user;
    } catch (error) {
      if (shouldLogoutForAuthError(error)) {
        get().clearSession();
        return null;
      }

      set({ isHydrated: true });
      throw error;
    }
  },
  loginCashier: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const response = await requestApi("/auth/cashier/login", {
        method: "POST",
        body: payload,
      });
      const user = normalizeUser(response.user, "cashier");

      get().setSession(user);
      return { ...response, user };
    } catch (error) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },
  loginAdmin: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const response = await requestApi("/auth/admin/login", {
        method: "POST",
        body: payload,
      });
      const user = normalizeUser(response.user, "admin");

      get().setSession(user);
      return { ...response, user };
    } catch (error) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },
  registerCashier: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const response = await requestApi("/auth/cashier/register", {
        method: "POST",
        body: payload,
      });
      const user = normalizeUser(response.user, "cashier");
      set({ isSubmitting: false, error: "" });
      return { ...response, user };
    } catch (error) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },
  requestCashierPasswordReset: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const response = await requestApi("/auth/cashier/request-reset-password", {
        method: "POST",
        body: payload,
      });

      set({ isSubmitting: false, error: "" });
      return response;
    } catch (error) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },
  resetCashierPassword: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const response = await requestApi("/auth/cashier/reset-password", {
        method: "POST",
        body: payload,
      });

      set({ isSubmitting: false, error: "" });
      return response;
    } catch (error) {
      set({ error: error.message, isSubmitting: false });
      throw error;
    }
  },
  refreshCurrentUser: async () => {
    try {
      const user = await requestApi("/auth/me");
      get().setSession(user);
      return user;
    } catch (error) {
      handleProtectedAuthError(error);
      throw error;
    }
  },
  updateCurrentUserProfile: async (payload) => {
    try {
      const response = await requestApi("/auth/me", {
        method: "PATCH",
        body: payload,
      });

      get().setSession(response.user);
      return response.user;
    } catch (error) {
      handleProtectedAuthError(error);
      throw error;
    }
  },
  updateCurrentUserPassword: async (payload) => {
    try {
      return await requestApi("/auth/me/password", {
        method: "PATCH",
        body: payload,
      });
    } catch (error) {
      handleProtectedAuthError(error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await requestApi("/auth/logout", {
        method: "POST",
      });
    } catch {
      // Clear local session even if server-side cookie clear fails.
    } finally {
      get().clearSession();
    }
  },
}));
