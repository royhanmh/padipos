import { createElement } from "react";
import { PiArrowUpRightLight } from "react-icons/pi";

const StatCardComponent = ({ icon, label, value, accent = false }) => {
  return (
    <article className="rounded-xl border border-[#ECECEC] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(25,45,88,0.05)] md:px-6 md:py-5">
      <p className="text-[13px] font-medium md:text-sm">{label}</p>
      <div className="mt-4 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-[#3572EF] md:h-10 md:w-10">
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
    </article>
  );
};

export default StatCardComponent;

