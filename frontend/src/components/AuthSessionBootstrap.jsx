import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../stores/authStore";

const AuthSessionBootstrap = ({ children }) => {
  const { isHydrated, initializeAuth } = useAuthStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
      initializeAuth: state.initializeAuth,
    })),
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || isHydrated) {
      return undefined;
    }

    initializedRef.current = true;

    initializeAuth().catch(() => null);
    return undefined;
  }, [initializeAuth, isHydrated]);

  return children;
};

export default AuthSessionBootstrap;
