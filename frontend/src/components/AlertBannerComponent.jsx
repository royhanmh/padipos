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

const AlertBannerComponent = ({
  variant = "success",
  message,
  onDismiss,
  className = "",
}) => {
  const styles = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.success;
  const dismissible = typeof onDismiss === "function";

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <div className={`flex items-start gap-4 ${styles.body}`}>
        {variant === "success" ? (
          <PiCheckCircleLight className={styles.icon} />
        ) : null}
        <p className={styles.message}>{message}</p>
        {dismissible ? (
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="text-[#3F3F3F] transition hover:text-[#151515]"
          >
            <PiXLight className="text-[20px]" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AlertBannerComponent;
