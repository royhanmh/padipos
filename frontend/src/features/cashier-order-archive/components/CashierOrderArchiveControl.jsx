import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  PiArrowCircleRightLight,
  PiBookmarkSimpleLight,
  PiCaretDownLight,
  PiMagnifyingGlassLight,
  PiXLight,
} from "react-icons/pi";
import {
  CASHIER_ARCHIVE_ORDERS,
  CASHIER_ORDER_TYPES,
} from "../data/archiveOrders";
import { savePendingArchiveRestore } from "../utils/archiveRestoreStorage";

const TAX_AMOUNT = 5000;

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const pad = (value) => String(value).padStart(2, "0");

const formatArchiveDateTime = (value) => {
  const date = new Date(value);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const itemsSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const CashierOrderArchiveControl = ({ onRestoreOrder }) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveSearchDraft, setArchiveSearchDraft] = useState("");
  const [archiveTypeDraft, setArchiveTypeDraft] = useState("all");
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveType, setArchiveType] = useState("all");

  const navigate = useNavigate();

  const filteredArchiveOrders = useMemo(() => {
    const keyword = archiveSearch.trim().toLowerCase();
    return CASHIER_ARCHIVE_ORDERS.filter((order) => {
      const matchType = archiveType === "all" || order.orderType === archiveType;
      const matchKeyword =
        keyword.length === 0 ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);

      return matchType && matchKeyword;
    });
  }, [archiveSearch, archiveType]);

  const handleRestore = (order) => {
    setIsArchiveOpen(false);

    if (onRestoreOrder) {
      onRestoreOrder(order);
      return;
    }

    savePendingArchiveRestore(order);
    navigate("/kasir/catalog");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsArchiveOpen(true)}
        className="flex items-center gap-2 rounded-xl px-2 py-2 text-base text-[#6B6B6B] transition hover:bg-[#F5F5F5] hover:text-[#3572EF]"
      >
        <PiBookmarkSimpleLight className="text-[18px]" />
        <span>Order Archive</span>
      </button>

      {isArchiveOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setIsArchiveOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[980px] rounded-[20px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEFEF] px-7 py-5">
              <h3 className="text-[44px] font-semibold text-[#171717]">
                Order Archive
              </h3>
              <button
                type="button"
                aria-label="Close archive modal"
                onClick={() => setIsArchiveOpen(false)}
                className="text-[#3E3E3E]"
              >
                <PiXLight className="text-[30px]" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_120px]">
                <label className="relative block">
                  <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[22px] text-[#B3B3B3]" />
                  <input
                    type="text"
                    value={archiveSearchDraft}
                    onChange={(event) => setArchiveSearchDraft(event.target.value)}
                    placeholder="Enter the keyword here..."
                    className="h-12 w-full rounded-xl border border-[#D7D7D7] pl-10 pr-4 text-base text-[#3B3B3B] outline-none placeholder:text-[#BCBCBC]"
                  />
                </label>

                <div className="relative">
                  <select
                    value={archiveTypeDraft}
                    onChange={(event) => setArchiveTypeDraft(event.target.value)}
                    className="h-12 w-full appearance-none rounded-xl border border-[#D7D7D7] px-4 text-base text-[#757575] outline-none"
                  >
                    <option value="all">Select type order</option>
                    <option value={CASHIER_ORDER_TYPES.DINE_IN}>Dine-in</option>
                    <option value={CASHIER_ORDER_TYPES.TAKE_AWAY}>Take Away</option>
                  </select>
                  <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A8A8A8]" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setArchiveSearch(archiveSearchDraft);
                    setArchiveType(archiveTypeDraft);
                  }}
                  className="h-12 rounded-xl bg-[#3572EF] text-[18px] text-white"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 max-h-[560px] overflow-y-auto pr-1">
                <div className="space-y-4">
                  {filteredArchiveOrders.map((order) => {
                    const orderSubTotal = itemsSubtotal(order.items);
                    const orderTax = orderSubTotal > 0 ? TAX_AMOUNT : 0;
                    const orderTotal = orderSubTotal + orderTax;

                    return (
                      <article
                        key={order.id}
                        className="rounded-xl bg-[#FAFAFA] px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[19px] text-[#8C8C8C]">
                              No Order{" "}
                              <span className="text-[#525252]">
                                {order.orderNumber}
                              </span>
                            </p>
                            <p className="mt-1 text-[17px] text-[#2E2E2E]">
                              {order.orderType === CASHIER_ORDER_TYPES.DINE_IN
                                ? "Dine-in"
                                : "Take Away"}{" "}
                              | {order.customerName} | No.{order.tableNumber || "--"}
                            </p>
                            <p className="mt-2 text-[42px] font-semibold text-[#191919] md:text-[42px]">
                              {formatCurrency(orderTotal)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-[#8D8D8D]">
                              {formatArchiveDateTime(order.createdAt)}
                            </p>
                            <button
                              type="button"
                              aria-label={`Restore ${order.orderNumber}`}
                              onClick={() => handleRestore(order)}
                              className="mt-3 ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#3572EF] text-[#3572EF] transition hover:bg-[#3572EF] hover:text-white"
                            >
                              <PiArrowCircleRightLight className="text-[20px]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {filteredArchiveOrders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#DADADA] px-5 py-12 text-center text-[#959595]">
                      No order archive matched your filter.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CashierOrderArchiveControl;
