import { PiDownloadSimpleLight } from "react-icons/pi";

const ExportMenu = ({
  open,
  onToggle,
  onExportExcel,
  onExportPdf,
  disabled = false,
  menuRef,
}) => {
  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Export report"
        onClick={onToggle}
        disabled={disabled}
        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-[24px] transition md:h-14 md:w-14 ${
          disabled
            ? "cursor-not-allowed border-[#E0E0E0] text-[#BFBFBF]"
            : "border-[#BFC4CB] text-[#6A6A6A] hover:bg-[#F8F8F8]"
        }`}
      >
        <PiDownloadSimpleLight />
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-20 min-w-[160px] overflow-hidden rounded-xl border border-[#E8E8E8] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.14)] md:top-16">
          <button
            type="button"
            onClick={onExportExcel}
            className="block w-full border-b border-[#EFEFEF] px-5 py-3 text-left text-base text-[#222222] transition hover:bg-[#F7F7F7]"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="block w-full px-5 py-3 text-left text-base text-[#222222] transition hover:bg-[#F7F7F7]"
          >
            Export PDF
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ExportMenu;
