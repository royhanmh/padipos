import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

const buildPageItems = (totalPages, currentPage) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
};

const PaginationControls = ({ page, totalPages, onPageChange }) => {
  const pages = buildPageItems(totalPages, page);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`flex h-11 w-11 items-center justify-center rounded-[10px] text-base transition ${
          page <= 1
            ? "cursor-not-allowed bg-[#EFEFEF] text-[#C2C2C2]"
            : "bg-[#F2F2F2] text-[#8A8A8A] hover:bg-[#E9E9E9]"
        }`}
      >
        <PiCaretLeftBold />
      </button>

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-11 min-w-11 items-center justify-center rounded-[10px] bg-[#F1F1F1] px-2.5 text-base text-[#8A8A8A]"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`flex h-11 w-11 items-center justify-center rounded-[10px] text-base transition ${
              item === page
                ? "bg-[#3572EF] text-white"
                : "bg-[#F1F1F1] text-[#8A8A8A] hover:bg-[#E9EDF9] hover:text-[#3A63D4]"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`flex h-11 w-11 items-center justify-center rounded-[10px] text-base transition ${
          page >= totalPages
            ? "cursor-not-allowed bg-[#EFEFEF] text-[#C2C2C2]"
            : "bg-[#3572EF] text-white hover:brightness-105"
        }`}
      >
        <PiCaretRightBold />
      </button>
    </div>
  );
};

export default PaginationControls;

