import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiArrowUpRightLight,
  PiCaretDownLight,
  PiXLight,
  PiReceiptLight,
  PiCoinsLight,
  PiNotebookLight,
  PiBowlFoodLight,
  PiCoffeeLight,
  PiCookieLight,
  PiMagnifyingGlassLight,
} from "react-icons/pi";
import StatCardComponent from "../../../components/StatCardComponent";
import { exportSalesToExcel, exportSalesToPdf } from "../export";
import {
  CATEGORY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  formatCurrency,
  formatSalesOrderDate,
  formatTodayLabel,
  getCategoryLabel,
  getOrderTypeLabel,
} from "../utils/reportFormatters";
import DatePickerField from "./DatePickerField";
import ExportMenu from "./ExportMenu";
import PaginationControls from "./PaginationControls";
import ReportFilterField from "./ReportFilterField";
import SkeletonTableRow from "./SkeletonTableRow";
import DashboardLayout from "../../../layouts/DashboardLayout";

const ROW_OPTIONS = [10, 25, 50];
const todayString = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

const DEFAULT_FILTERS = {
  startDate: todayString,
  finishDate: todayString,
  category: "all",
  orderType: "all",
};

const DEFAULT_EXPORT_CONFIG = {
  title: "Sales Report",
  filenamePrefix: "sales-report",
};
const MOBILE_SKELETON_CARDS = 4;

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

const isSameLocalDayAsToday = (value) => {
  const orderDate = new Date(value);

  if (Number.isNaN(orderDate.getTime())) {
    return false;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  return orderDate >= todayStart && orderDate <= todayEnd;
};

const matchesCategoryFilter = (order, category) => {
  if (category === "all") {
    return true;
  }

  if (Array.isArray(order.categories) && order.categories.length > 0) {
    return order.categories.includes(category);
  }

  return order.category === category;
};

const SalesReportView = ({
  orders,
  statsOrders,
  paginationMeta,
  isLoading = false,
  statsLoading = isLoading,
  errorMessage = "",
  pageTitle = "Sales Report",
  layoutSidebarProps,
  layoutTopbarProps,
  onRequestTransactions,
  exportConfig = DEFAULT_EXPORT_CONFIG,
  showStats = false,
}) => {
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [rowsPerPage, setRowsPerPage] = useState(ROW_OPTIONS[0]);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const exportMenuRef = useRef(null);

  const currentPage = paginationMeta?.page ?? page;
  const totalPages = Math.max(1, paginationMeta?.total_pages ?? 1);

  useEffect(() => {
    if (typeof onRequestTransactions !== "function") {
      return;
    }

    void onRequestTransactions({
      page,
      limit: rowsPerPage,
      startDate: appliedFilters.startDate,
      finishDate: appliedFilters.finishDate,
      category: appliedFilters.category,
      orderType: appliedFilters.orderType,
    });
  }, [appliedFilters, onRequestTransactions, page, rowsPerPage]);

  const todayOrders = useMemo(() => {
    return (statsOrders ?? orders).filter((order) => isSameLocalDayAsToday(order.orderDate));
  }, [orders, statsOrders]);

  const { stats, categoryDetails } = useMemo(() => {
    let totalOmzet = 0;
    let allMenuSales = 0;
    let foodsCount = 0;
    let beveragesCount = 0;
    let dessertsCount = 0;

    const categoryItemSales = {
      food: {},
      beverage: {},
      dessert: {},
    };

    todayOrders.forEach((order) => {
      totalOmzet += order.total;
      (order.items || []).forEach((item) => {
        allMenuSales += item.quantity;
        const cat = item.category;

        if (cat === "food") foodsCount += item.quantity;
        if (cat === "beverage") beveragesCount += item.quantity;
        if (cat === "dessert") dessertsCount += item.quantity;

        if (cat && categoryItemSales[cat]) {
          categoryItemSales[cat][item.name] = (categoryItemSales[cat][item.name] || 0) + item.quantity;
        }
      });
    });

    const formatCatData = (catKey, title) => {
      const items = Object.keys(categoryItemSales[catKey]).map(name => ({
        name,
        totalSales: categoryItemSales[catKey][name]
      })).sort((a,b) => b.totalSales - a.totalSales);
      return { title, items };
    };

    const computedCategoryDetails = {
      food: formatCatData("food", "Foods"),
      beverage: formatCatData("beverage", "Beverages"),
      dessert: formatCatData("dessert", "Desserts")
    };

    const computedStats = [
      { label: "Total Orders", value: String(todayOrders.length), icon: PiReceiptLight },
      { label: "Total Omzet", value: formatCurrency(totalOmzet), icon: PiCoinsLight },
      { label: "All Menu Orders", value: String(allMenuSales), icon: PiNotebookLight },
      { label: "Foods", value: String(foodsCount), icon: PiBowlFoodLight, accent: true, categoryKey: "food" },
      { label: "Beverages", value: String(beveragesCount), icon: PiCoffeeLight, accent: true, categoryKey: "beverage" },
      { label: "Desserts", value: String(dessertsCount), icon: PiCookieLight, accent: true, categoryKey: "dessert" },
    ];

    return { stats: computedStats, categoryDetails: computedCategoryDetails };
  }, [todayOrders]);

  const activeDetail = activeCategory ? categoryDetails[activeCategory] : null;
  const filteredItems = activeDetail
    ? activeDetail.items.filter((item) =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
    : [];

  const openCategoryModal = (category) => {
    setActiveCategory(category);
    setSearchKeyword("");
  };

  const closeCategoryModal = () => {
    setActiveCategory(null);
    setSearchKeyword("");
  };

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
    exportSalesToExcel(orders, appliedFilters, exportConfig);
    setIsExportOpen(false);
  };

  const handleExportPdf = () => {
    exportSalesToPdf(orders, appliedFilters, exportConfig);
    setIsExportOpen(false);
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById("sales-report-receipt-content");
    if (!printContent) {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const completeHtml = `
      <html>
        <head>
          <title>POS Receipt</title>
          <style>
            @page { margin: 0; }
            body { margin: 0.5cm; font-family: sans-serif; color: #111; max-width: 340px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .items-start { align-items: flex-start; }
            .gap-4 { gap: 16px; }
            .font-semibold { font-weight: 600; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .mt-2\\.5 { margin-top: 10px; }
            .mt-3 { margin-top: 12px; }
            .mt-4 { margin-top: 16px; }
            .pt-3 { padding-top: 12px; }
            .pt-4 { padding-top: 16px; }
            .pb-4 { padding-bottom: 16px; }
            .px-4 { padding-left: 16px; padding-right: 16px; }
            .px-5 { padding-left: 20px; padding-right: 20px; }
            .py-4 { padding-top: 16px; padding-bottom: 16px; }
            .py-5 { padding-top: 20px; padding-bottom: 20px; }
            .border-t { border-top-width: 1px; border-top-style: dashed; border-top-color: #cfcfcf; }
            .text-\\[12px\\] { font-size: 12px; }
            .text-\\[13px\\] { font-size: 13px; }
            .text-\\[14px\\] { font-size: 14px; }
            .text-\\[18px\\] { font-size: 18px; }
            .text-\\[24px\\] { font-size: 24px; }
            .text-\\[\\#8E8E8E\\], .text-\\[\\#666666\\], .text-\\[\\#767676\\], .text-\\[\\#6D6D6D\\], .text-\\[\\#585858\\] { color: #555; }
            .text-\\[\\#323232\\], .text-\\[\\#1E1E1E\\], .text-\\[\\#272727\\], .text-\\[\\#2F2F2F\\] { color: #111; }
            span[aria-hidden="true"] { display: none; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    iframe.contentDocument.open();
    iframe.contentDocument.write(completeHtml);
    iframe.contentDocument.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  };

  const renderOrderTypeLine = (order) => {
    if (order.orderType === "dine-in") {
      return `Dine-in - No.Meja ${order.tableNumber ?? "-"}`;
    }

    return "Take Away";
  };

  const renderTableState = () => {
    if (errorMessage) {
      return errorMessage;
    }

    return "No transactions matched the selected filters.";
  };

  return (
    <DashboardLayout
      sidebarProps={layoutSidebarProps}
      topbarProps={layoutTopbarProps}
    >
      <section className="min-h-full bg-[#F7F7F7] px-6 py-6 max-lg:px-4 max-lg:py-4 xl:px-8 xl:py-7">
        <div className="flex items-center justify-between gap-3 max-lg:flex-col max-lg:items-start">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#111111] max-lg:text-[26px]">
            {pageTitle}
          </h1>
          <p className="text-base text-[#666666]">{formatTodayLabel()}</p>
        </div>

        {showStats && (
          <div className="mt-6 grid grid-cols-2 gap-5 max-lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-6">
            {stats.map((stat) => (
              <StatCardComponent
                key={stat.label}
                {...stat}
                isLoading={statsLoading}
                onClick={stat.categoryKey ? () => openCategoryModal(stat.categoryKey) : undefined}
              />
            ))}
          </div>
        )}

        <section className="mt-6 rounded-[10px] border border-[#ECECEC] bg-white p-6 shadow-[0_10px_26px_rgba(25,45,88,0.06)] max-lg:p-5">
          {errorMessage ? (
            <div className="mb-5 rounded-[10px] border border-[#FAD7DB] bg-[#FFF7F8] px-4 py-3 text-base text-[#B42318] max-lg:text-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(150px,0.85fr)_auto] xl:items-end">
            <ReportFilterField label="Start">
              <DatePickerField
                value={draftFilters.startDate}
                onChange={(nextValue) => handleFilterChange("startDate", nextValue)}
                placeholder="Select date"
              />
            </ReportFilterField>

            <ReportFilterField label="Finish">
              <DatePickerField
                value={draftFilters.finishDate}
                onChange={(nextValue) => handleFilterChange("finishDate", nextValue)}
                placeholder="Select date"
              />
            </ReportFilterField>

            <ReportFilterField label="Category">
              <div className="relative">
                <select
                  name="salesReportCategory"
                  value={draftFilters.category}
                  onChange={(event) => handleFilterChange("category", event.target.value)}
                  className="h-12 w-full appearance-none rounded-[10px] border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition focus:border-[#C7D6FF] md:h-13 md:px-5"
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
                  name="salesReportOrderType"
                  value={draftFilters.orderType}
                  onChange={(event) => handleFilterChange("orderType", event.target.value)}
                  className="h-12 w-full appearance-none rounded-[10px] border border-[#DCDCDC] px-4 pr-10 text-base text-[#535353] outline-none transition focus:border-[#C7D6FF] md:h-13 md:px-5"
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
              className="h-13 w-full min-w-0 rounded-[10px] bg-[#3572EF] px-7 text-base font-medium text-white transition hover:brightness-105 2xl:min-w-44"
            >
              Search
            </button>

            <ExportMenu
              open={isExportOpen}
              onToggle={() => setIsExportOpen((currentOpen) => !currentOpen)}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              disabled={orders.length === 0 || isLoading}
              menuRef={exportMenuRef}
            />
          </div>

          <div className="mt-5 min-w-0 overflow-hidden rounded-[10px] border border-[#EFEFEF]">
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-245 border-collapse">
                  <thead className="bg-[#F2F2F2] text-left">
                    <tr className="text-base font-semibold text-[#1F1F1F]">
                      <th className="px-6 py-5">No Order</th>
                      <th className="px-6 py-5">Order Date</th>
                      <th className="px-6 py-5">Order Type</th>
                      <th className="px-6 py-5">Category</th>
                      <th className="px-6 py-5">Customer Name</th>
                      <th className="px-6 py-5 text-center">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, index) => (
                        <SkeletonTableRow key={index} />
                      ))
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.id ?? order.uuid ?? order.orderNumber}
                          className="border-t border-[#F0F0F0] text-base text-[#353535]"
                        >
                          <td className="px-6 py-5">{order.orderNumber}</td>
                          <td className="px-6 py-5">{formatSalesOrderDate(order.orderDate)}</td>
                          <td className="px-6 py-5">{getOrderTypeLabel(order.orderType)}</td>
                          <td className="px-6 py-5">{getCategoryLabel(order.category)}</td>
                          <td className="px-6 py-5">{order.customerName}</td>
                          <td className="px-6 py-5 text-center">
                            <button
                              type="button"
                              aria-label={`Open order ${order.orderNumber}`}
                              onClick={() => setSelectedOrder(order)}
                              className="text-[#3572EF] transition hover:text-[#1255DE]"
                            >
                              <PiArrowUpRightLight className="inline text-[26px]" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-[#F0F0F0]">
                        <td colSpan={6} className="px-5 py-11 text-center text-base text-[#939393]">
                          {renderTableState()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 p-4 lg:hidden">
              {isLoading ? (
                [...Array(MOBILE_SKELETON_CARDS)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[10px] border border-[#EFEFEF] bg-white p-4"
                  >
                    <div className="h-4 w-24 animate-pulse rounded-[10px] bg-[#F1F1F1]" />
                    <div className="mt-2 h-6 w-40 animate-pulse rounded-[10px] bg-[#F1F1F1]" />
                    <div className="mt-4 space-y-2.5">
                      {[...Array(4)].map((__, innerIndex) => (
                        <div key={innerIndex} className="flex items-center justify-between gap-4">
                          <div className="h-3 w-22 animate-pulse rounded-[10px] bg-[#F1F1F1]" />
                          <div className="h-3 w-32 animate-pulse rounded-[10px] bg-[#F1F1F1]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <article
                    key={order.id ?? order.uuid ?? order.orderNumber}
                    className="rounded-[10px] border border-[#EFEFEF] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-[#9B9B9B]">No Order</p>
                        <p className="mt-1 truncate text-base font-semibold text-[#1F1F1F]">
                          {order.orderNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Open order ${order.orderNumber}`}
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#3572EF] transition hover:text-[#1255DE]"
                      >
                        <PiArrowUpRightLight className="text-[24px]" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-[#8D8D8D]">Order Date</p>
                        <p className="max-w-[62%] text-right text-sm text-[#353535]">
                          {formatSalesOrderDate(order.orderDate)}
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-[#8D8D8D]">Order Type</p>
                        <p className="max-w-[62%] text-right text-sm text-[#353535]">
                          {getOrderTypeLabel(order.orderType)}
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-[#8D8D8D]">Category</p>
                        <p className="max-w-[62%] text-right text-sm text-[#353535]">
                          {getCategoryLabel(order.category)}
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-[#8D8D8D]">Customer Name</p>
                        <p className="max-w-[62%] break-words text-right text-sm text-[#353535]">
                          {order.customerName || "-"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[10px] border border-dashed border-[#E8E8E8] bg-white px-4 py-8 text-center text-sm text-[#939393]">
                  {renderTableState()}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#EFEFEF] px-6 py-5 max-lg:flex-col max-lg:items-stretch max-lg:px-4 max-lg:py-4">
              <label className="flex items-center gap-3 text-base text-[#5E5E5E] max-lg:justify-between">
                <span>Show:</span>
                <select
                  name="salesReportRowsPerPage"
                  value={rowsPerPage}
                  onChange={(event) => handleRowsPerPageChange(event.target.value)}
                  className="h-9 rounded-[10px] border border-[#E0E0E0] bg-white px-3 text-base text-[#5C5C5C] outline-none"
                >
                  {ROW_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span>Entries</span>
              </label>

              <div className="max-lg:overflow-x-auto">
                <PaginationControls
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
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
            className="relative max-h-[90vh] w-full max-w-155 overflow-y-auto rounded-[10px] bg-white px-9 py-10 shadow-[0_22px_60px_rgba(17,24,39,0.2)] scrollbar-hide max-lg:max-h-[calc(100vh-1.25rem)] max-lg:max-w-[360px] max-lg:rounded-[10px] max-lg:px-4 max-lg:py-4 xl:scale-80"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close detail"
              onClick={closeDetailModal}
              className="absolute right-6 top-6 text-[#4A4A4A] transition hover:text-[#1B1B1B] max-lg:right-3 max-lg:top-3"
            >
              <PiXLight className="text-[26px] max-lg:text-[20px]" />
            </button>

            <h2 className="pt-4 text-center text-[36px] font-semibold tracking-[-0.03em] text-[#111111] max-lg:pt-1 max-lg:text-[22px]">
              Transaction Detail
            </h2>

            <div id="sales-report-receipt-content" className="mx-auto mt-7 w-full max-w-102.5 max-lg:mt-4">
              <div className="overflow-hidden rounded-t-[10px] bg-[#F3F3F3] px-5 py-5 max-lg:px-3 max-lg:py-3">
                <p className="text-[13px] text-[#8E8E8E] max-lg:text-[11px]">
                  No Order <span className="text-[#666666]">{selectedOrder.orderNumber}</span>
                </p>
                <p className="mt-2 text-[13px] text-[#8E8E8E] max-lg:mt-1.5 max-lg:text-[11px]">
                  Order Date <span className="text-[#666666]">{formatSalesOrderDate(selectedOrder.orderDate)}</span>
                </p>
                <p className="mt-2 text-[13px] text-[#8E8E8E] max-lg:mt-1.5 max-lg:text-[11px]">
                  Customer Name <span className="text-[#666666]">{selectedOrder.customerName}</span>
                </p>
                <p className="mt-2.5 text-[14px] text-[#323232] max-lg:mt-2 max-lg:text-[12px]">{renderOrderTypeLine(selectedOrder)}</p>

                <div className="mt-4 border-t border-dashed border-[#CFCFCF] pt-4 max-lg:mt-3 max-lg:pt-3">
                  <div className="space-y-4 max-lg:space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id ?? item.name} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[18px] font-semibold text-[#1E1E1E] max-lg:text-[15px]">{item.name}</p>
                          <p className="text-[14px] text-[#767676] max-lg:text-[12px]">
                            {item.quantity} x {formatCurrency(item.unitPrice ?? item.price ?? 0)}
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-[#272727] max-lg:text-[11px]">
                          {formatCurrency(item.quantity * (item.unitPrice ?? item.price ?? 0))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-dashed border-[#CFCFCF] pt-4 max-lg:mt-3 max-lg:pt-3">
                  <div className="flex items-center justify-between text-[14px] text-[#6D6D6D] max-lg:text-[12px]">
                    <p>Sub Total</p>
                    <p>{formatCurrency(selectedOrder.subTotal)}</p>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[14px] text-[#6D6D6D] max-lg:mt-2 max-lg:text-[12px]">
                    <p>Tax</p>
                    <p>{formatCurrency(selectedOrder.tax)}</p>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-dashed border-[#CFCFCF] bg-[#ECECEC] px-5 pb-5 pt-6 max-lg:px-3 max-lg:pb-3 max-lg:pt-4">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-white max-lg:-left-2 max-lg:h-4 max-lg:w-4"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-white max-lg:-right-2 max-lg:h-4 max-lg:w-4"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[18px] text-[#2F2F2F] max-lg:text-[14px]">Total</p>
                  <p className="text-[24px] font-semibold text-[#272727] max-lg:text-[18px]">{formatCurrency(selectedOrder.total)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between text-base text-[#585858] max-lg:mt-2 max-lg:text-[12px]">
                  <p>Diterima</p>
                  <p>{formatCurrency(selectedOrder.amountPaid)}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between pb-10 text-base text-[#585858] max-lg:mt-2 max-lg:pb-6 max-lg:text-[12px]">
                  <p>Kembalian</p>
                  <p>{formatCurrency(selectedOrder.change)}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintReceipt}
              className="mx-auto mt-5 flex h-[42px] w-full max-w-102.5 items-center justify-center rounded-[10px] bg-[#3572EF] text-[14px] font-medium text-white transition hover:brightness-105 max-lg:mt-4 max-lg:h-[40px] max-lg:max-w-none"
            >
              Print Struk
            </button>
          </div>
        </div>
      ) : null}
      {activeDetail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.18)] px-4"
          onClick={closeCategoryModal}
        >
          <div
            className="w-full max-w-[500px] rounded-[10px] bg-white shadow-[0_24px_60px_rgba(17,24,39,0.18)] max-lg:max-w-105"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEFEF] px-5 py-4">
              <h3 className="text-[34px] font-semibold tracking-[-0.03em] text-[#212121] max-lg:text-[32px]">
                {activeDetail.title}
              </h3>
              <button
                type="button"
                aria-label="Close popup"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#646464] transition hover:bg-[#F6F6F6] max-lg:h-9 max-lg:w-9"
                onClick={closeCategoryModal}
              >
                <PiXLight className="text-[22px]" />
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="relative block">
                <PiMagnifyingGlassLight className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#C2C2C2]" />
                <input
                  type="text"
                  name="salesReportCategorySearch"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Enter the keyword here..."
                  className="h-12 w-full rounded-[10px] border border-[#E9E9E9] bg-white pl-11 pr-4 text-base text-[#4B4B4B] outline-none placeholder:text-[#D0D0D0] focus:border-[#C8D8FF] max-lg:h-11 max-lg:pl-10"
                />
              </label>

              <div className="mt-4 overflow-hidden rounded-[10px] border border-[#F0F0F0]">
                <div className="grid grid-cols-[1fr_132px] bg-[#F7F7F7] px-5 py-3 text-sm font-semibold text-[#2F2F2F]">
                  <p>Menu Name</p>
                  <p>Total Sales</p>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[1fr_132px] border-t border-[#F3F3F3] px-5 py-4 text-base text-[#313131]"
                    >
                      <p>{item.name}</p>
                      <p>{item.totalSales}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default SalesReportView;
