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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-4 py-8">
      <div className="w-full max-w-[540px] rounded-[20px] border border-[#F0F0F0] bg-white px-8 py-10 text-center shadow-[0_14px_36px_rgba(25,45,88,0.05)] md:px-12 md:py-14">
        {Icon && (
          <div
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[24px] border md:h-28 md:w-28"
            style={{ 
              color: colors.primary, 
              borderColor: colors.border,
              backgroundColor: colors.bg 
            }}
          >
            <Icon className="text-[44px] md:text-[52px]" />
          </div>
        )}

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#161616] md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mb-10 max-w-[380px] text-base leading-relaxed text-[#6A6A6A] md:text-lg">
          {subtitle}
        </p>

        <div className="grid gap-4 sm:grid-cols-1">
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
