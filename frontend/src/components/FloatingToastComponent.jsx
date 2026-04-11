import { useEffect, useState } from "react";
import { PiCheckCircleLight, PiXLight } from "react-icons/pi";

const FloatingToastComponent = ({
  message,
  onDismiss,
  className = "",
  toastClassName = "",
  placement = "fixed",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [message]);

  if (!message) {
    return null;
  }

  const placementClassName =
    placement === "panel-top" || placement === "container-top"
      ? "absolute inset-x-3 top-6 z-[80] lg:inset-x-0 lg:top-0"
      : "fixed inset-x-3 top-[7.25rem] z-[70] flex justify-end sm:inset-x-4 lg:inset-x-auto lg:right-6 lg:top-[5.5rem]";
  const toastWidthClassName =
    placement === "panel-top" || placement === "container-top"
      ? "max-w-none"
      : "max-w-[420px]";
  const animationClassName = isVisible && !isLeaving
    ? "translate-y-0 opacity-100"
    : "-translate-y-3 opacity-0";
  const handleDismiss = () => {
    if (typeof onDismiss !== "function") {
      return;
    }

    setIsLeaving(true);
    setIsVisible(false);
    window.setTimeout(() => {
      onDismiss();
    }, 320);
  };

  return (
    <div
      className={`pointer-events-none ${placementClassName} ${className}`.trim()}
    >
      <div className={`pointer-events-auto w-full ${toastWidthClassName} rounded-[10px] border border-[#EAEAEA] bg-white shadow-[0_16px_36px_rgba(25,45,88,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none motion-reduce:transition-none ${animationClassName} ${toastClassName}`.trim()}>
        <div className="flex items-start gap-3 border-l-[3px] border-[#22C55E] px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
          <PiCheckCircleLight className="mt-0.5 shrink-0 text-[24px] text-[#16A34A] sm:text-[30px]" />
          <p className="mt-0.5 flex-1 text-sm leading-6 text-[#171717] sm:mt-1.5 sm:text-base">
            {message}
          </p>
          {typeof onDismiss === "function" ? (
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={handleDismiss}
              className="shrink-0 text-[#3F3F3F] transition hover:text-[#151515]"
            >
              <PiXLight className="text-[18px] sm:text-[20px]" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FloatingToastComponent;
