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
        className="relative flex items-center gap-2 rounded-xl px-2 py-2 text-base text-[#6B6B6B] transition hover:bg-[#F5F5F5] hover:text-[#3572EF]"
      >
        <PiBookmarkSimpleLight className="text-[18px]" />
        <span>Order Archive</span>
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
            className="w-full max-w-[760px] rounded-[20px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEFEF] px-7 py-5 shrink-0">
              <h3 className="text-[26px] font-semibold text-[#171717] md:text-[28px]">
                Order Archive
              </h3>
              <button
                type="button"
                aria-label="Close archive modal"
                onClick={() => setIsArchiveOpen(false)}
                className="text-[#646464] hover:text-[#272727] transition"
              >
                <PiXLight className="text-[30px]" />
              </button>
            </div>

            <div className="bg-[#F8F9FB] px-6 py-6 md:px-7 md:py-7 flex flex-col gap-5 rounded-b-[28px] min-h-[400px] max-h-[75vh]">
              
              <div className="flex flex-col gap-3 md:flex-row md:items-center w-full z-10 shrink-0">
                <div className="relative flex-1">
                  <PiMagnifyingGlassLight className="absolute top-1/2 left-4 -translate-y-1/2 text-[18px] text-[#A6A6A6]" />
                  <input 
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter the keyword here..." 
                    className="w-full h-[46px] pl-[42px] pr-4 rounded-[12px] border border-[#E9E9E9] text-sm text-[#272727] placeholder:text-[#A6A6A6] outline-none focus:border-[#3572EF] transition bg-white"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative w-[180px]">
                    <select 
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full h-[46px] pl-4 pr-10 appearance-none rounded-[12px] border border-[#E9E9E9] text-sm text-[#A6A6A6] outline-none focus:border-[#3572EF] transition bg-white"
                    >
                      <option value="">Select type order</option>
                      <option value="dine-in">Dine-in</option>
                      <option value="take-away">Take Away</option>
                    </select>
                    <PiCaretDownLight className="absolute top-1/2 right-4 -translate-y-1/2 text-[16px] text-[#A6A6A6] pointer-events-none" />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleSearch}
                    className="h-[46px] px-7 bg-[#3572EF] rounded-[12px] text-white text-[15px] hover:bg-[#2A5BC0] transition shrink-0 shadow-[0_4px_12px_rgba(53,114,239,0.15)]"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-[14px]">
                {filteredOrders.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#D4DCEB] bg-white px-6 py-12 text-center">
                    <p className="text-[20px] font-semibold text-[#6E6E6E]">No archive orders found</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="group relative flex flex-col justify-between rounded-[16px] border border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.02)] bg-white p-[22px] transition hover:shadow-[0_4px_24px_rgba(55,114,239,0.08)]">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-[14px] text-[#3E3E3E]">
                          <p>
                            <span className="text-[#A2A2A2]">No Order</span> 
                            <span className="font-medium text-[#272727] ml-[6px]">{order.orderNumber}</span>
                          </p>
                          <div className="w-[1px] h-3.5 bg-[#DDDDDD]" />
                          <p className="font-medium capitalize text-[#272727]">{order.orderType?.replace("-", " ")}</p>
                          {order.customerName && (
                            <>
                              <div className="w-[1px] h-3.5 bg-[#DDDDDD]" />
                              <p className="font-medium text-[#272727]">{order.customerName}</p>
                            </>
                          )}
                          {order.tableNumber && (
                            <>
                              <div className="w-[1px] h-3.5 bg-[#DDDDDD]" />
                              <p className="font-medium text-[#272727]">No.{order.tableNumber.toString().padStart(2, '0')}</p>
                            </>
                          )}
                        </div>
                        <p className="text-[13px] font-medium text-[#B2B2B2] shrink-0 ml-4 mt-0.5">
                          {formatDate(order.archivedAt)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-5">
                        <p className="text-[20px] font-semibold text-[#1A1A1A]">
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
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#3572EF] text-[#3572EF] transition hover:bg-[#3572EF] hover:text-white"
                        >
                          <PiArrowRightLight className="text-[18px]" />
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
