import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiArrowUpRightLight,
  PiCalendarBlankLight,
  PiCaretDownLight,
  PiXLight,
} from "react-icons/pi";
import ExportMenu from "../../features/sales-report/components/ExportMenu";
import PaginationControls from "../../features/sales-report/components/PaginationControls";
import ReportFilterField from "../../features/sales-report/components/ReportFilterField";
import { MOCK_SALES_ORDERS } from "../../features/sales-report/data/mockSalesOrders";
import {
  exportSalesToExcel,
  exportSalesToPdf,
} from "../../features/sales-report/export";
import {
  CATEGORY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  formatCurrency,
  formatSalesOrderDate,
  formatTodayLabel,
  getCategoryLabel,
  getOrderTypeLabel,
} from "../../features/sales-report/utils/reportFormatters";
import DashboardLayout from "../../layouts/DashboardLayout";

const ROW_OPTIONS = [10, 25, 50];
const DEFAULT_FILTERS = {
  startDate: "",
  finishDate: "",
  category: "all",
  orderType: "all",
};

const toDateAtStartOfDay = (value) => {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00`);
};

const toDateAtEndOfDay = (value) => {
  if (!value) {
    return null;
  }

  return new Date(`${value}T23:59:59`);
};

const SalesReportPage = () => {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [rowsPerPage, setRowsPerPage] = useState(ROW_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportMenuRef = useRef(null);

  const filteredOrders = useMemo(() => {
    const startDate = toDateAtStartOfDay(appliedFilters.startDate);
    const finishDate = toDateAtEndOfDay(appliedFilters.finishDate);

    return MOCK_SALES_ORDERS.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const matchesStartDate = startDate ? orderDate >= startDate : true;
      const matchesFinishDate = finishDate ? orderDate <= finishDate : true;
      const matchesCategory =
        appliedFilters.category === "all" ||
        order.category === appliedFilters.category;
      const matchesOrderType =
        appliedFilters.orderType === "all" ||
        order.orderType === appliedFilters.orderType;

      return (
        matchesStartDate &&
        matchesFinishDate &&
        matchesCategory &&
        matchesOrderType
      );
    }).sort((firstOrder, secondOrder) => {
      return new Date(secondOrder.orderDate) - new Date(firstOrder.orderDate);
    });
  }, [appliedFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, page, rowsPerPage]);

  useEffect(() => {
    if (!isExportOpen) {
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (exportMenuRef.current?.contains(event.target)) {
        return;
      }

      setIsExportOpen(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [isExportOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setSelectedOrder(null);
      setIsExportOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleFilterChange = (key, value) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const applySearchFilter = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setPage(1);
  };

  const closeDetailModal = () => setSelectedOrder(null);

  const handleExportExcel = () => {
    exportSalesToExcel(filteredOrders, appliedFilters);
    setIsExportOpen(false);
  };

  const handleExportPdf = () => {
    exportSalesToPdf(filteredOrders, appliedFilters);
    setIsExportOpen(false);
  };

  const renderOrderTypeLine = (order) => {
    if (order.orderType === "dine-in") {
      return `Dine-in - No.Meja ${order.tableNumber ?? "-"}`;
    }

    return "Take Away";
  };

  return (
    <DashboardLayout sidebarProps={{ activeItem: "orders" }}>
      <section className="min-h-full bg-[#F7F7F7] px-5 py-5 md:px-6 md:py-6 2xl:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#111111] md:text-[28px]">
            Sales Report
          </h1>
          <p className="text-base text-[#666666]">{formatTodayLabel()}</p>
        </div>

        <section className="mt-6 rounded-2xl border border-[#ECECEC] bg-white p-5 shadow-[0_10px_26px_rgba(25,45,88,0.06)] md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(150px,0.85fr)_auto] lg:items-end">
            <ReportFilterField label="Start">
              <div className="relative">
                <input
                  type="date"
                  value={draftFilters.startDate}
                  onChange={(event) =>
                    handleFilterChange("startDate", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition [color-scheme:light] focus:border-[#C7D6FF] md:h-[52px] md:px-5"
                />
                <PiCalendarBlankLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#A8A8A8]" />
              </div>
            </ReportFilterField>

            <ReportFilterField label="Finish">
              <div className="relative">
                <input
                  type="date"
                  value={draftFilters.finishDate}
                  onChange={(event) =>
                    handleFilterChange("finishDate", event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition [color-scheme:light] focus:border-[#C7D6FF] md:h-[52px] md:px-5"
                />
                <PiCalendarBlankLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-[#A8A8A8]" />
              </div>
            </ReportFilterField>

            <ReportFilterField label="Category">
              <div className="relative">
                <select
                  value={draftFilters.category}
                  onChange={(event) =>
                    handleFilterChange("category", event.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition focus:border-[#C7D6FF] md:h-[52px] md:px-5"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A8A8A8]" />
              </div>
            </ReportFilterField>

            <ReportFilterField label="Order Type">
              <div className="relative">
                <select
                  value={draftFilters.orderType}
                  onChange={(event) =>
                    handleFilterChange("orderType", event.target.value)
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition focus:border-[#C7D6FF] md:h-[52px] md:px-5"
                >
                  {ORDER_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[22px] text-[#A8A8A8]" />
              </div>
            </ReportFilterField>

            <button
              type="button"
              onClick={applySearchFilter}
              className="h-[52px] w-full min-w-0 rounded-xl bg-[#4D7CFE] px-7 text-[22px] font-medium text-white transition hover:brightness-105 2xl:min-w-44"
            >
              Search
            </button>

            <ExportMenu
              open={isExportOpen}
              onToggle={() => setIsExportOpen((currentOpen) => !currentOpen)}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              disabled={filteredOrders.length === 0}
              menuRef={exportMenuRef}
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#EFEFEF]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead className="bg-[#F2F2F2] text-left">
                  <tr className="text-[17px] font-semibold text-[#1F1F1F]">
                    <th className="px-6 py-5">No Order</th>
                    <th className="px-6 py-5">Order Date</th>
                    <th className="px-6 py-5">Order Type</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Customer Name</th>
                    <th className="px-6 py-5 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-[#F0F0F0] text-[17px] text-[#353535]"
                      >
                        <td className="px-6 py-5">{order.orderNumber}</td>
                        <td className="px-6 py-5">
                          {formatSalesOrderDate(order.orderDate)}
                        </td>
                        <td className="px-6 py-5">
                          {getOrderTypeLabel(order.orderType)}
                        </td>
                        <td className="px-6 py-5">
                          {getCategoryLabel(order.category)}
                        </td>
                        <td className="px-6 py-5">{order.customerName}</td>
                        <td className="px-6 py-5 text-center">
                          <button
                            type="button"
                            aria-label={`Open order ${order.orderNumber}`}
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#4D7CFE] transition hover:text-[#2957DA]"
                          >
                            <PiArrowUpRightLight className="inline text-[26px]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-[#F0F0F0]">
                      <td
                        colSpan={6}
                        className="px-5 py-11 text-center text-lg text-[#939393]"
                      >
                        No transactions matched the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#EFEFEF] px-6 py-5 md:flex-row md:items-center md:justify-between">
              <label className="flex items-center gap-3 text-lg text-[#5E5E5E]">
                <span>Show:</span>
                <select
                  value={rowsPerPage}
                  onChange={(event) =>
                    handleRowsPerPageChange(event.target.value)
                  }
                  className="h-9 rounded-lg border border-[#E0E0E0] bg-white px-3 text-base text-[#5C5C5C] outline-none"
                >
                  {ROW_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>Entries</span>
              </label>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </section>
      </section>

      {selectedOrder ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={closeDetailModal}
        >
          <div
            className="relative w-full max-w-[620px] origin-center scale-70 rounded-[22px] bg-white px-10 py-10 shadow-[0_22px_60px_rgba(17,24,39,0.22)] md:px-9 md:py-10"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close detail"
              onClick={closeDetailModal}
              className="absolute right-6 top-5 text-[#4A4A4A] transition hover:text-[#1B1B1B] md:right-7 md:top-6"
            >
              <PiXLight className="text-[26px]" />
            </button>

            <h2 className="text-center text-[36px] font-semibold tracking-[-0.03em] text-[#111111] pt-20">
              Transaction Detail
            </h2>

            <div className="mx-auto mt-7 w-full max-w-[410px]">
              <div className="overflow-hidden rounded-t-[2px] bg-[#F3F3F3] px-5 py-5">
                <p className="text-[13px] text-[#8E8E8E]">
                  No Order{" "}
                  <span className="text-[#666666]">
                    {selectedOrder.orderNumber}
                  </span>
                </p>
                <p className="mt-2 text-[13px] text-[#8E8E8E]">
                  Order Date{" "}
                  <span className="text-[#666666]">
                    {formatSalesOrderDate(selectedOrder.orderDate)}
                  </span>
                </p>
                <p className="mt-2 text-[13px] text-[#8E8E8E]">
                  Customer Name{" "}
                  <span className="text-[#666666]">
                    {selectedOrder.customerName}
                  </span>
                </p>
                <p className="mt-2.5 text-[14px] text-[#323232]">
                  {renderOrderTypeLine(selectedOrder)}
                </p>

                <div className="mt-4 border-t border-dashed border-[#CFCFCF] pt-4">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-start justify-between gap-4"
                      >
                        <div>
                          <p className="text-[18px] font-semibold text-[#1E1E1E]">
                            {item.name}
                          </p>
                          <p className="text-[14px] text-[#767676]">
                            {item.quantity} x {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-[#272727]">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-dashed border-[#CFCFCF] pt-4">
                  <div className="flex items-center justify-between text-[14px] text-[#6D6D6D]">
                    <p>Sub Total</p>
                    <p>{formatCurrency(selectedOrder.subTotal)}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[14px] text-[#6D6D6D]">
                    <p>Tax</p>
                    <p>{formatCurrency(selectedOrder.tax)}</p>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-dashed border-[#CFCFCF] bg-[#ECECEC] px-5 pb-5 pt-6">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-white"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-white"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[18px] text-[#2F2F2F]">Total</p>
                  <p className="text-[24px] font-semibold text-[#272727]">
                    {formatCurrency(selectedOrder.total)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[17px] text-[#585858]">
                  <p>Diterima</p>
                  <p>{formatCurrency(selectedOrder.amountPaid)}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[17px] text-[#585858] pb-10">
                  <p>Kembalian</p>
                  <p>{formatCurrency(selectedOrder.change)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default SalesReportPage;
