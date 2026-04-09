import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../stores/authStore";

const AuthSessionBootstrap = ({ children }) => {
  const { isHydrated, token, refreshCurrentUser } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
      token: state.token,
      refreshCurrentUser: state.refreshCurrentUser,
    })),
  );
  const checkedTokenRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (!isHydrated) {
      return () => {
        isMounted = false;
      };
    }

    if (!token) {
      checkedTokenRef.current = null;
      return () => {
        isMounted = false;
      };
    }

    if (checkedTokenRef.current === token) {
      return () => {
        isMounted = false;
      };
    }

    checkedTokenRef.current = token;

    refreshCurrentUser()
      .catch(() => null)
      .finally(() => {
        if (isMounted) {
          // No-op
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isHydrated, refreshCurrentUser, token]);

  return children;
};

export default AuthSessionBootstrap;
