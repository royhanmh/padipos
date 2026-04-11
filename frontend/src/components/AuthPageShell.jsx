import { useEffect, useState } from "react";

const AUTH_BACKGROUND_SRC = "/images/background-optimized.jpg";
const AUTH_BACKGROUND_PRELOAD_ID = "auth-background-preload";

const AuthPageShell = ({ children }) => {
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);

  useEffect(() => {
    const existingPreload = document.getElementById(AUTH_BACKGROUND_PRELOAD_ID);
    let preloadLink = null;

    if (!existingPreload) {
      preloadLink = document.createElement("link");
      preloadLink.id = AUTH_BACKGROUND_PRELOAD_ID;
      preloadLink.rel = "preload";
      preloadLink.as = "image";
      preloadLink.href = AUTH_BACKGROUND_SRC;
      preloadLink.type = "image/jpeg";
      preloadLink.setAttribute("fetchpriority", "high");
      document.head.appendChild(preloadLink);
    }

    return () => {
      if (preloadLink?.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const markReady = () => {
      if (isMounted) {
        setIsBackgroundReady(true);
      }
    };

    const image = new Image();
    image.src = AUTH_BACKGROUND_SRC;

    if (image.complete) {
      markReady();
      return () => {
        isMounted = false;
      };
    }

    image.onload = markReady;
    image.onerror = markReady;

    if (typeof image.decode === "function") {
      image.decode().then(markReady).catch(() => {});
    }

    return () => {
      isMounted = false;
      image.onload = null;
      image.onerror = null;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#DDE8FF]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(221,232,255,0.9)_42%,_rgba(197,215,255,0.96)_100%)]" />
      <div
        className={`absolute inset-0 bg-cover bg-top transition-opacity duration-500 ${
          isBackgroundReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url('${AUTH_BACKGROUND_SRC}')` }}
      />
      <div className="relative flex min-h-screen items-center px-6 py-10 max-lg:items-start max-lg:px-4 max-lg:py-6">
        {children}
      </div>
    </div>
  );
};

export default AuthPageShell;
