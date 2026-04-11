import { createElement } from "react";
import { PiArrowUpRightLight } from "react-icons/pi";

const StatCardComponent = ({ icon, label, value, accent = false, onClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-[10px] border border-[#ECECEC] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(25,45,88,0.05)] md:px-6 md:py-5">
        <div className="h-4 w-24 animate-pulse rounded bg-[#F2F2F2] md:h-5" />
        <div className="mt-4 flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-[10px] bg-[#F2F2F2] md:h-10 md:w-10" />
            <div className="h-7 w-20 animate-pulse rounded bg-[#F2F2F2] md:h-8" />
          </div>
          {accent && (
            <div className="h-5 w-5 animate-pulse rounded bg-[#F8F8F8] self-end" />
          )}
        </div>
      </div>
    );
  }

  const isInteractive = typeof onClick === "function";
  const Container = isInteractive ? "button" : "article";

  return (
    <Container
      className={`rounded-[10px] border border-[#ECECEC] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(25,45,88,0.05)] md:px-6 md:py-5 ${
        isInteractive
          ? "cursor-pointer text-left transition hover:border-[#DDE7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3572EF] focus-visible:ring-offset-2"
          : ""
      }`}
      {...(isInteractive
        ? {
            type: "button",
            onClick,
            "aria-label": `Open ${label} sales detail`,
          }
        : {})}
    >
      <p className="text-[13px] font-medium md:text-sm">{label}</p>
      <div className="mt-4 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[#3572EF] md:h-10 md:w-10">
            {icon
              ? createElement(icon, { className: "text-[32px] md:text-[34px]" })
              : null}
          </div>
          <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] text-[#343434] md:text-[28px]">
            {value}
          </p>
        </div>

        {accent && (
          <PiArrowUpRightLight className="self-end text-[16px] text-[#6392F3]" />
        )}
      </div>
    </Container>
  );
};

export default StatCardComponent;

