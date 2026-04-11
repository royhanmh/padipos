import { PiCheckCircleLight, PiXLight } from "react-icons/pi";

const VARIANT_CLASSES = {
  success: {
    wrapper:
      "rounded-[10px] border border-[#EAEAEA] bg-white shadow-[0_16px_36px_rgba(25,45,88,0.08)]",
    body: "border-l-[3px] border-[#22C55E] px-6 py-6",
    icon: "mt-0.5 text-[30px] text-[#16A34A]",
    message: "mt-1.5 flex-1 text-base text-[#171717]",
  },
  error: {
    wrapper: "rounded-[10px] border border-[#FAD7DB] bg-[#FFF7F8]",
    body: "px-6 py-5 text-[#B42318]",
    icon: "mt-0.5 text-[30px] text-[#FF3333]",
    message: "mt-1.5 flex-1 text-base",
  },
};

const AUTH_SUCCESS_CLASSES = {
  wrapper: "rounded-[10px] border border-[#B7E6C1] bg-[#F3FCF5]",
  body: "px-6 py-5 text-[#166534]",
  icon: "mt-0.5 text-[30px] text-[#16A34A]",
  message: "mt-1.5 flex-1 text-base",
};

const AlertBannerComponent = ({
  variant = "success",
  message,
  onDismiss,
  className = "",
  authSuccessStyle = false,
  isAuthLayout = false,
}) => {
  const styles =
    variant === "success" && authSuccessStyle
      ? AUTH_SUCCESS_CLASSES
      : VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.success;
  const dismissible = typeof onDismiss === "function";
  const authBodyResponsiveClass = isAuthLayout
    ? "max-lg:gap-3 max-lg:px-4 max-lg:py-3.5"
    : "";
  const authIconResponsiveClass = isAuthLayout
    ? "max-lg:mt-0 max-lg:text-[22px]"
    : "";
  const authMessageResponsiveClass = isAuthLayout
    ? "max-lg:mt-0 max-lg:text-[14px] max-lg:leading-5 break-words"
    : "";
  const dismissButtonClass =
    variant === "success" && authSuccessStyle
      ? "text-[#166534] transition hover:text-[#14532D]"
      : "text-[#3F3F3F] transition hover:text-[#151515]";
  const dismissButtonResponsiveClass = isAuthLayout
    ? "max-lg:-mr-1 max-lg:mt-0.5 max-lg:flex max-lg:h-7 max-lg:w-7 max-lg:items-center max-lg:justify-center"
    : "";

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div className={`flex items-start gap-4 ${styles.body} ${authBodyResponsiveClass}`.trim()}>
        {variant === "success" ? (
          <PiCheckCircleLight className={`${styles.icon} ${authIconResponsiveClass}`.trim()} />
        ) : null}
        <p className={`${styles.message} ${authMessageResponsiveClass}`.trim()}>{message}</p>
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className={`${dismissButtonClass} ${dismissButtonResponsiveClass}`.trim()}
          >
            <PiXLight className="text-[20px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AlertBannerComponent;
