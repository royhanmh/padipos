import { Link } from "react-router";
import PrimaryButtonComponent from "./PrimaryButtonComponent";

const SystemStatePage = ({
  tone = "brand",
  icon: Icon,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}) => {
  const toneColors = {
    brand: {
      primary: "#3572EF",
      bg: "#EFF4FF",
      border: "#DCE5FF",
    },
    maintenance: {
      primary: "#FFB800",
      bg: "#FFF9E8",
      border: "#FFE5A0",
    },
    error: {
      primary: "#FF3333",
      bg: "#FFF4F2",
      border: "#FFD5D0",
    },
  };

  const colors = toneColors[tone] || toneColors.brand;
  const actionGridClassName = secondaryAction
    ? "grid-cols-2 max-lg:grid-cols-1"
    : "grid-cols-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-6 py-10 max-lg:px-4 max-lg:py-6">
      <div className="w-full max-w-[540px] rounded-[10px] border border-[#F0F0F0] bg-white px-12 py-14 text-center shadow-[0_14px_36px_rgba(25,45,88,0.05)] max-lg:px-8 max-lg:py-10">
        {Icon && (
          <div
            className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[10px] border max-lg:h-24 max-lg:w-24"
            style={{ 
              color: colors.primary, 
              borderColor: colors.border,
              backgroundColor: colors.bg 
            }}
          >
            <Icon className="text-[52px] max-lg:text-[44px]" />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#161616] max-lg:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mb-10 max-w-[380px] text-lg leading-relaxed text-[#6A6A6A] max-lg:text-base">
          {subtitle}
        </p>

        <div className={`grid gap-4 ${actionGridClassName}`}>
          {primaryAction && (
            <div className="w-full">
              {primaryAction.to ? (
                <Link to={primaryAction.to}>
                  <PrimaryButtonComponent
                    className="w-full"
                    style={{ backgroundColor: colors.primary, boxShadow: "none" }}
                  >
                    {primaryAction.label}
                  </PrimaryButtonComponent>
                </Link>
              ) : (
                <PrimaryButtonComponent
                  className="w-full"
                  style={{ backgroundColor: colors.primary, boxShadow: "none" }}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </PrimaryButtonComponent>
              )}
            </div>
          )}

          {secondaryAction && (
            <div className="w-full">
              {secondaryAction.to ? (
                <Link
                  to={secondaryAction.to}
                  className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#DCDCDC] bg-white text-base font-medium text-[#4D4D4D] transition hover:bg-[#F9F9F9]"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  className="flex h-12 w-full items-center justify-center rounded-[10px] border border-[#DCDCDC] bg-white text-base font-medium text-[#4D4D4D] transition hover:bg-[#F9F9F9]"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStatePage;
