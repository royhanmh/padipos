import { useState } from "react";
import { 
  PiBookmarkSimpleLight, 
  PiXLight, 
  PiMagnifyingGlassLight,
  PiCaretDownLight,
  PiArrowRightLight
} from "react-icons/pi";
import { useArchiveStore } from "../../../stores/archiveStore";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatCurrency = (value) => 
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const getOrderTotal = (order) => {
  const subTotal = (order.cartItems || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subTotal > 0 ? 5000 : 0;
  return subTotal + tax;
};

const CashierOrderArchiveControl = ({ onRestore }) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const archivedOrders = useArchiveStore((state) => state.archivedOrders);
  const removeArchive = useArchiveStore((state) => state.removeArchive);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [appliedType, setAppliedType] = useState("");

  const handleSearch = () => {
    setAppliedKeyword(keyword.trim());
    setAppliedType(typeFilter);
  };

  const filteredOrders = archivedOrders.filter((order) => {
    const matchKeyword = !appliedKeyword 
       || order.orderNumber.toLowerCase().includes(appliedKeyword.toLowerCase())
       || (order.customerName || "").toLowerCase().includes(appliedKeyword.toLowerCase());
    
    const matchType = !appliedType || order.orderType === appliedType;
    
    return matchKeyword && matchType;
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsArchiveOpen(true)}
        aria-label="Order archive"
        className="relative flex h-11 items-center gap-2 rounded-xl px-3 text-base text-[#6B6B6B] transition hover:bg-[#F5F5F5] hover:text-[#3572EF] max-lg:h-10 max-lg:w-10 max-lg:justify-center max-lg:px-0"
      >
        <PiBookmarkSimpleLight className="text-[18px]" />
        <span className="max-lg:hidden">Order Archive</span>
        {archivedOrders.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF3B30] text-[10px] font-bold text-white">
            {archivedOrders.length}
          </span>
        )}
      </button>

      {isArchiveOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setIsArchiveOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="flex max-h-[90vh] w-full max-w-[760px] flex-col rounded-[20px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)] md:rounded-[28px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#EFEFEF] px-5 py-4 md:px-7 md:py-5">
              <h3 className="text-[22px] font-semibold text-[#171717] md:text-[28px]">
                Order Archive
              </h3>
              <button
                type="button"
                aria-label="Close archive modal"
                onClick={() => setIsArchiveOpen(false)}
                className="text-[#646464] transition hover:text-[#272727]"
              >
                <PiXLight className="text-[24px] md:text-[30px]" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-b-[20px] bg-[#F8F9FB] px-4 py-5 md:gap-5 md:rounded-b-[28px] md:px-7 md:py-7">
              <div className="z-10 flex shrink-0 flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <PiMagnifyingGlassLight className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#A6A6A6]" />
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter the keyword here..." 
                    className="h-[46px] w-full bg-white pl-[42px] pr-4 rounded-[12px] border border-[#E9E9E9] text-sm text-[#272727] placeholder:text-[#A6A6A6] outline-none transition focus:border-[#3572EF]"
                  />
                </div>
                <div className="flex gap-3 max-md:grid max-md:grid-cols-[1fr_auto]">
                  <div className="relative md:w-[180px]">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="h-[46px] w-full appearance-none rounded-[12px] border border-[#E9E9E9] bg-white pl-4 pr-10 text-sm text-[#A6A6A6] outline-none transition focus:border-[#3572EF]"
                    >
                      <option value="">Select type order</option>
                      <option value="dine-in">Dine-in</option>
                      <option value="take-away">Take Away</option>
                    </select>
                    <PiCaretDownLight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[16px] text-[#A6A6A6]" />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleSearch}
                    className="h-[46px] rounded-[12px] bg-[#3572EF] px-7 text-[15px] font-medium text-white shadow-[0_4px_12px_rgba(53,114,239,0.15)] transition hover:brightness-105 active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-[14px] overflow-y-auto pr-1 scrollbar-hide">
                {filteredOrders.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#D4DCEB] bg-white px-6 py-12 text-center">
                    <p className="text-[18px] font-semibold text-[#6E6E6E] md:text-[20px]">No archive orders found</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="group relative flex flex-col justify-between rounded-[16px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition hover:shadow-[0_4px_24px_rgba(55,114,239,0.08)] md:p-[22px]">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-[#3E3E3E] md:text-[14px]">
                          <p>
                            <span className="text-[#A2A2A2]">No Order</span> 
                            <span className="ml-[6px] font-medium text-[#272727]">{order.orderNumber}</span>
                          </p>
                          <div className="h-3.5 w-[1px] bg-[#DDDDDD] max-md:hidden" />
                          <p className="font-medium capitalize text-[#272727]">{order.orderType?.replace("-", " ")}</p>
                          {(order.customerName || order.tableNumber) && (
                            <>
                              <div className="h-3.5 w-[1px] bg-[#DDDDDD]" />
                              <div className="flex items-center gap-2">
                                {order.customerName && <p className="font-medium text-[#272727]">{order.customerName}</p>}
                                {order.customerName && order.tableNumber && <span className="text-[#D0D0D0]">·</span>}
                                {order.tableNumber && (
                                  <p className="font-medium text-[#272727]">No.{order.tableNumber.toString().padStart(2, '0')}</p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        <p className="text-[12px] font-medium text-[#B2B2B2] md:mt-0.5 md:text-[13px]">
                          {formatDate(order.archivedAt)}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between md:mt-5">
                        <p className="text-[18px] font-bold text-[#1A1A1A] md:text-[20px]">
                          {formatCurrency(getOrderTotal(order))}
                        </p>
                        
                        <button
                          type="button"
                          aria-label="Restore Order"
                          onClick={() => {
                            if (onRestore) onRestore(order);
                            removeArchive(order.id);
                            setIsArchiveOpen(false);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#3572EF] text-[#3572EF] transition hover:bg-[#3572EF] hover:text-white md:h-10 md:w-10"
                        >
                          <PiArrowRightLight className="text-[18px] md:text-[20px]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CashierOrderArchiveControl;
