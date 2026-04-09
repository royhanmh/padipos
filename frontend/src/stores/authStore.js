import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ApiError, requestApi } from "../lib/apiClient";

const STORAGE_KEY = "pos-sederhana-auth";

const normalizeUser = (user, fallbackRole = null) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    role: user.role ?? fallbackRole,
  };
};

const buildSessionState = ({ token = null, user = null } = {}) => ({
  token,
  user,
  role: user?.role ?? null,
  isAuthenticated: Boolean(token && user),
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
    useAuthStore.getState().logout();
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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...buildSessionState(),
      isHydrated: false,
      isSubmitting: false,
      error: "",
      setHydrated: () =>
        set((state) => ({
          isHydrated: true,
          isAuthenticated: Boolean(state.token && state.user),
          role: state.user?.role ?? null,
        })),
      clearError: () => set({ error: "" }),
      setSession: ({ token, user }) => {
        const normalizedUser = normalizeUser(user);

        set({
          ...buildSessionState({ token, user: normalizedUser }),
          error: "",
          isSubmitting: false,
        });
      },
      loginCashier: async (payload) => {
        set({ isSubmitting: true, error: "" });

        try {
          const response = await requestApi("/auth/cashier/login", {
            method: "POST",
            body: payload,
          });
          const user = normalizeUser(response.user, "cashier");

          get().setSession({ token: response.token, user });
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

          get().setSession({ token: response.token, user });
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
        const token = get().token;

        if (!token) {
          return null;
        }

        try {
          const user = await requestApi("/auth/me", { token });
          get().setSession({ token, user: normalizeUser(user) });
          return user;
        } catch (error) {
          handleProtectedAuthError(error);

          throw error;
        }
      },
      updateCurrentUserProfile: async (payload) => {
        const token = get().token;

        if (!token) {
          throw new ApiError("Authentication required.", { status: 401 });
        }

        const response = await requestApi("/auth/me", {
          method: "PATCH",
          token,
          body: payload,
        });

        get().setSession({ token, user: normalizeUser(response.user) });
        return response.user;
      },
      updateCurrentUserPassword: async (payload) => {
        const token = get().token;

        if (!token) {
          throw new ApiError("Authentication required.", { status: 401 });
        }

        return requestApi("/auth/me/password", {
          method: "PATCH",
          token,
          body: payload,
        });
      },
      logout: () =>
        set({
          ...buildSessionState(),
          isHydrated: true,
          isSubmitting: false,
          error: "",
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated?.();
      },
    },
  ),
);
