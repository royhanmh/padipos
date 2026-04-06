import { useEffect, useState } from "react";

const AUTH_BACKGROUND_SRC = "/images/background-optimized.jpg";

const AuthPageShell = ({ children }) => {
  const [isBackgroundReady, setIsBackgroundReady] = useState(false);

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
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
          isBackgroundReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: `url('${AUTH_BACKGROUND_SRC}')` }}
      />
      <div className="relative flex min-h-screen items-center px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default AuthPageShell;
