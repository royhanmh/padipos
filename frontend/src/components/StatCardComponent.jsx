import { createElement } from "react";
import { PiArrowUpRightLight } from "react-icons/pi";

const StatCardComponent = ({ icon, label, value, accent = false }) => {
  return (
    <article className="rounded-xl border border-[#ECECEC] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(25,45,88,0.05)]">
      <p className="text-[12px] font-medium">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[#4D7CFE]">
            {icon ? createElement(icon, { className: "text-[30px]" }) : null}
          </div>
          <p className="text-[24px] font-semibold leading-none tracking-[-0.02em] text-[#343434]">
            {value}
          </p>
        </div>

        {accent && (
          <PiArrowUpRightLight className="self-end text-[15px] text-[#7EA4FF]" />
        )}
      </div>
    </article>
  );
};

export default StatCardComponent;
