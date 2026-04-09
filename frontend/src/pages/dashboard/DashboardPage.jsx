import { useState, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTransactionsStore } from "../../stores/transactionsStore";
import {
  PiBowlFoodLight,
  PiCaretDownLight,
  PiCoffeeLight,
  PiCoinsLight,
  PiCookieLight,
  PiMagnifyingGlassLight,
  PiNotebookLight,
  PiReceiptLight,
  PiXLight,
} from "react-icons/pi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCardComponent from "../../components/StatCardComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import DatePickerField from "../../features/sales-report/components/DatePickerField";
import { formatTodayLabel } from "../../features/sales-report/utils/reportFormatters";

const formatAxisTick = (value) => {
  if (value === 0) {
    return "0";
  }

  return `${value / 1000}k`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const CHART_CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "food", label: "Foods" },
  { value: "beverage", label: "Beverages" },
  { value: "dessert", label: "Desserts" },
];

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

const createDateRangeMap = (start, finish) => {
  const dayMap = {};
  let current;
  let end;

  if (start && finish) {
    current = new Date(start);
    end = new Date(finish);
  } else {
    const today = new Date();
    current = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    end = today;
  }

  current.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const date = new Date(current);
  while (date <= end) {
    const dateKey = date.toDateString();
    // For short ranges, show "Mon". For longer ranges, show "1 Mar"
    const diffTime = Math.abs(end - current);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let label;
    if (diffDays <= 7) {
      label = date.toLocaleDateString("id-ID", { weekday: "short" });
    } else {
      label = `${date.getDate()} ${date.toLocaleDateString("id-ID", { month: "short" })}`;
    }

    const fullDate = date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    dayMap[dateKey] = { day: label, fullDate, food: 0, beverage: 0, dessert: 0 };
    date.setDate(date.getDate() + 1);
  }

  return dayMap;
};

const buildOmzetData = (
  transactions,
  { startDate = "", finishDate = "", category = "all" } = {},
) => {
  const start = toDateAtStartOfDay(startDate);
  const finish = toDateAtEndOfDay(finishDate);
  const dayMap = createDateRangeMap(start, finish);

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.created_at);
    const inStartRange = start ? transactionDate >= start : true;
    const inFinishRange = finish ? transactionDate <= finish : true;

    if (!inStartRange || !inFinishRange) {
      return;
    }

    const dateKey = new Date(
      transactionDate.getFullYear(),
      transactionDate.getMonth(),
      transactionDate.getDate(),
    ).toDateString();
    const dayRecord = dayMap[dateKey];

    if (!dayRecord) {
      return;
    }

    transaction.items.forEach((item) => {
      const itemCategory = item.product_category;
      if (!itemCategory || typeof dayRecord[itemCategory] !== "number") {
        return;
      }

      dayRecord[itemCategory] += Number(item.subtotal_item);
    });
  });

  const mappedData = Object.values(dayMap);
  if (category === "all") {
    return mappedData;
  }

  return mappedData.map((row) => ({
    ...row,
    food: category === "food" ? row.food : 0,
    beverage: category === "beverage" ? row.beverage : 0,
    dessert: category === "dessert" ? row.dessert : 0,
  }));
};

const DashboardPage = () => {
  const { transactions, isLoading, fetchTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      isLoading: state.isLoading,
      fetchTransactions: state.fetchTransactions,
    }))
  );

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const { stats, categoryDetails } = useMemo(() => {
    let totalOrders = transactions.length;
    let totalOmzet = 0;
    let allMenuOrders = 0;
    let foodsCount = 0;
    let beveragesCount = 0;
    let dessertsCount = 0;

    const categoryItemSales = {
      food: {},
      beverage: {},
      dessert: {},
    };

    transactions.forEach((tx) => {
      totalOmzet += tx.total;

      tx.items.forEach((item) => {
        allMenuOrders += item.quantity;
        const cat = item.product_category;
        
        if (cat === "food") foodsCount += item.quantity;
        if (cat === "beverage") beveragesCount += item.quantity;
        if (cat === "dessert") dessertsCount += item.quantity;

        if (cat) {
          categoryItemSales[cat][item.product_title] =
            (categoryItemSales[cat][item.product_title] || 0) + item.quantity;
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
      { label: "Total Orders", value: String(totalOrders), icon: PiReceiptLight },
      { label: "Total Omzet", value: formatCurrency(totalOmzet), icon: PiCoinsLight },
      { label: "All Menu Orders", value: String(allMenuOrders), icon: PiNotebookLight },
      { label: "Foods", value: String(foodsCount), icon: PiBowlFoodLight, accent: true, categoryKey: "food" },
      { label: "Beverages", value: String(beveragesCount), icon: PiCoffeeLight, accent: true, categoryKey: "beverage" },
      { label: "Desserts", value: String(dessertsCount), icon: PiCookieLight, accent: true, categoryKey: "dessert" }
    ];

    return { stats: computedStats, categoryDetails: computedCategoryDetails };
  }, [transactions]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [selectedChartCategory, setSelectedChartCategory] = useState("all");
  const [isCompactChart, setIsCompactChart] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 1023px)").matches;
  });

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
  const isInvalidDateRange = useMemo(() => {
    if (!startDate || !finishDate) {
      return false;
    }

    return toDateAtStartOfDay(startDate) > toDateAtEndOfDay(finishDate);
  }, [finishDate, startDate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (event) => setIsCompactChart(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const chartMargin = isCompactChart
    ? { top: 8, right: 5, left: -15, bottom: 0 }
    : { top: 10, right: 10, left: -10, bottom: 0 };
  const chartTicks = [0, 50000, 100000, 150000, 200000, 250000, 300000];
  const chartTickFontSize = isCompactChart ? 10 : 12;
  const chartBarSize = isCompactChart ? 16 : 22;
  const chartLegendPaddingTop = isCompactChart ? "10px" : "18px";
  const baseOmzetData = useMemo(() => buildOmzetData(transactions), [transactions]);
  const filteredOmzetData = useMemo(() => {
    if (isInvalidDateRange) {
      return baseOmzetData;
    }

    return buildOmzetData(transactions, {
      startDate,
      finishDate,
      category: selectedChartCategory,
    });
  }, [
    baseOmzetData,
    finishDate,
    isInvalidDateRange,
    selectedChartCategory,
    startDate,
    transactions,
  ]);

  const xAxisInterval = useMemo(() => {
    const count = filteredOmzetData.length;
    if (count > 60) return 9; // Show approx ~6 ticks for 2 months
    if (count > 30) return 4; // Show approx ~6 ticks for 1 month
    if (count > 14) return 1; // Show every 2nd tick
    return 0; // Show all
  }, [filteredOmzetData.length]);

  return (
    <DashboardLayout sidebarProps={{ activeItem: "dashboard" }}>
      <section className="min-h-full bg-[#F7F7F7] px-6 py-6 max-lg:px-4 max-lg:py-4 xl:px-8 xl:py-7">
        <div className="flex items-center justify-between gap-3 max-lg:flex-col max-lg:items-start">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#242424] max-lg:text-[26px]">
            Dashboard
          </h1>
          <p className="text-base text-[#757575]">{formatTodayLabel()}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 max-lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-6">
          {stats.map((stat) => (
            <StatCardComponent
              key={stat.label}
              {...stat}
              isLoading={isLoading}
              onClick={
                stat.categoryKey
                  ? () => openCategoryModal(stat.categoryKey)
                  : undefined
              }
            />
          ))}
        </div>

        <section className="mt-5 rounded-xl border border-[#ECECEC] bg-white p-6 shadow-[0_12px_32px_rgba(25,45,88,0.05)] max-lg:p-5 xl:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#242424] max-lg:text-[26px]">
              Total Omzet
            </h2>

            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 xl:grid-cols-3">
              <DatePickerField
                value={startDate}
                onChange={setStartDate}
                disabled={false}
                placeholder="Start date"
                triggerClassName="min-w-52 border-[#E9E9E9] px-5 text-base text-[#535353] max-lg:min-w-0 max-lg:px-4 max-lg:text-sm md:h-12 md:px-5"
                iconClassName="text-[16px] text-[#A8A8A8]"
              />
              <DatePickerField
                value={finishDate}
                onChange={setFinishDate}
                disabled={false}
                placeholder="Finish date"
                triggerClassName="min-w-52 border-[#E9E9E9] px-5 text-base text-[#535353] max-lg:min-w-0 max-lg:px-4 max-lg:text-sm md:h-12 md:px-5"
                iconClassName="text-[16px] text-[#A8A8A8]"
              />
              <div className="relative">
                <select
                  value={selectedChartCategory}
                  onChange={(event) => setSelectedChartCategory(event.target.value)}
                  disabled={false}
                  className="h-12 min-w-52 w-full appearance-none rounded-xl border border-[#E9E9E9] bg-white px-5 pr-10 text-base text-[#535353] outline-none transition focus:border-[#C7D6FF] max-lg:min-w-0 max-lg:px-4 max-lg:text-sm md:h-12 md:px-5"
                >
                  {CHART_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#A8A8A8]" />
              </div>
            </div>
          </div>
          {isInvalidDateRange ? (
            <p className="mt-3 text-sm text-[#B42318]">
              Finish date must be the same as or after start date.
            </p>
          ) : null}

          <div className="mt-7 h-[400px] min-w-0 w-full max-lg:h-[300px]">
            {isLoading ? (
              <div className="flex h-full w-full items-end justify-between gap-4 pb-12 px-2 pt-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-4">
                    <div className="flex w-full items-end justify-center gap-1.5">
                      <div
                        className="w-[16%] animate-pulse rounded-t bg-[#F0F0F0]"
                        style={{ height: `${20 + Math.random() * 40}%` }}
                      />
                      <div
                        className="w-[16%] animate-pulse rounded-t bg-[#F5F5F5]"
                        style={{ height: `${30 + Math.random() * 50}%` }}
                      />
                      <div
                        className="w-[16%] animate-pulse rounded-t bg-[#FAFAFA]"
                        style={{ height: `${10 + Math.random() * 30}%` }}
                      />
                    </div>
                    <div className="h-3 w-10 animate-pulse rounded bg-[#F2F2F2]" />
                  </div>
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredOmzetData}
                  margin={chartMargin}
                  barCategoryGap={isCompactChart ? 12 : 18}
                >
                  <CartesianGrid
                    stroke="#E8E8E8"
                    strokeDasharray="4 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={xAxisInterval}
                    tick={{ fill: "#9C9C9C", fontSize: chartTickFontSize }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tick={{ fill: "#9C9C9C", fontSize: chartTickFontSize }}
                    tickFormatter={formatAxisTick}
                    domain={[0, (dataMax) => Math.max(300000, Math.ceil(dataMax / 50000) * 50000)]}
                    ticks={chartTicks}
                  />
                  <Tooltip
                    labelFormatter={(value, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullDate;
                      }
                      return value;
                    }}
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #E6EAF2",
                      boxShadow: "0 10px 25px rgba(25,45,88,0.08)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: chartLegendPaddingTop }}
                    iconType="square"
                    iconSize={isCompactChart ? 10 : 14}
                    formatter={(value) => (
                      <span
                        className={`text-[#4A4A4A] ${isCompactChart ? "text-xs" : "text-sm"}`}
                      >
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="food"
                    name="Food"
                    fill="#1C49A6"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={chartBarSize}
                  />
                  <Bar
                    dataKey="beverage"
                    name="Beverage"
                    fill="#3572EF"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={chartBarSize}
                  />
                  <Bar
                    dataKey="dessert"
                    name="Dessert"
                    fill="#C2D4FA"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={chartBarSize}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {activeDetail ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.18)] px-4"
            onClick={closeCategoryModal}
          >
            <div
              className="w-full max-w-[500px] rounded-xl bg-white shadow-[0_24px_60px_rgba(17,24,39,0.18)] max-lg:max-w-105"
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
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="Enter the keyword here..."
                    className="h-12 w-full rounded-xl border border-[#E9E9E9] bg-white pl-11 pr-4 text-base text-[#4B4B4B] outline-none placeholder:text-[#D0D0D0] focus:border-[#C8D8FF] max-lg:h-11 max-lg:pl-10"
                  />
                </label>

                <div className="mt-4 overflow-hidden rounded-xl border border-[#F0F0F0]">
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
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;

