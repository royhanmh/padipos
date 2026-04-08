import { useEffect, useRef, useState } from "react";
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!isHydrated) {
      return () => {
        isMounted = false;
      };
    }

    if (!token) {
      checkedTokenRef.current = null;
      setIsCheckingSession(false);
      return () => {
        isMounted = false;
      };
    }

    if (checkedTokenRef.current === token) {
      setIsCheckingSession(false);
      return () => {
        isMounted = false;
      };
    }

    checkedTokenRef.current = token;
    setIsCheckingSession(true);

    refreshCurrentUser()
      .catch(() => null)
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isHydrated, refreshCurrentUser, token]);

  if (!isHydrated || isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-6 text-center text-[#6A6A6A]">
        <p className="text-base">Loading session...</p>
      </div>
    );
  }

  return children;
};

export default AuthSessionBootstrap;
