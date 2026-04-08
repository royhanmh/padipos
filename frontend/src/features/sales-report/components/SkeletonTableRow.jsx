import React from "react";

const SkeletonTableRow = () => {
  return (
    <tr className="border-t border-[#F0F0F0]">
      <td className="px-6 py-5">
        <div className="h-5 w-24 animate-pulse rounded bg-[#F2F2F2]" />
      </td>
      <td className="px-6 py-5">
        <div className="h-5 w-32 animate-pulse rounded bg-[#F2F2F2]" />
      </td>
      <td className="px-6 py-5">
        <div className="h-5 w-20 animate-pulse rounded bg-[#F8F8F8]" />
      </td>
      <td className="px-6 py-5">
        <div className="h-5 w-16 animate-pulse rounded bg-[#F8F8F8]" />
      </td>
      <td className="px-6 py-5">
        <div className="h-5 w-36 animate-pulse rounded bg-[#F2F2F2]" />
      </td>
      <td className="px-6 py-5 text-center">
        <div className="inline-block h-6 w-6 animate-pulse rounded bg-[#F8F8F8]" />
      </td>
    </tr>
  );
};

export default SkeletonTableRow;
