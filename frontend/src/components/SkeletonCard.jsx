import React from "react";

const SkeletonCard = () => {
  return (
    <div className="flex min-h-[208px] flex-col rounded-[10px] border border-transparent bg-white p-3 shadow-[0_8px_24px_rgba(25,45,88,0.05)] 2xl:min-h-[214px]">
      <div className="relative overflow-hidden rounded-[10px] bg-[#F2F2F2]">
        <div className="h-[116px] w-full animate-pulse 2xl:h-[120px]" />
        <div className="absolute right-2.5 top-2.5 h-6 w-16 animate-pulse rounded-full bg-[#E5E5E5]" />
      </div>

      <div className="mt-3 flex flex-1 flex-col 2xl:mt-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#F2F2F2]" />
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-[#F8F8F8]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-[#F8F8F8]" />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1 2xl:pt-3">
          <div className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-[#F2F2F2]" />
            <div className="h-3 w-12 animate-pulse rounded bg-[#F8F8F8]" />
          </div>
          <div className="h-7 w-7 animate-pulse rounded-full bg-[#F2F2F2] 2xl:h-8 2xl:w-8" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
