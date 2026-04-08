import { createElement, useState, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTransactionsStore } from "../../stores/transactionsStore";
import {
  PiBowlFoodLight,
  PiCalendarBlankLight,
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

const FilterField = ({ placeholder, icon, suffixIcon }) => {
  return (
    <button
      type="button"
      className="flex h-12 min-w-52 items-center justify-between rounded-xl border border-[#E9E9E9] bg-white px-5 text-base text-[#B8B8B8] max-lg:min-w-0 max-lg:px-4 max-lg:text-sm"
    >
      <span>{placeholder}</span>
      {icon
        ? createElement(icon, { className: "text-[16px] text-[#BBBBBB]" })
        : null}
      {suffixIcon
        ? createElement(suffixIcon, { className: "text-[16px] text-[#BBBBBB]" })
        : null}
    </button>
  );
};

const DashboardPage = () => {

  const { transactions, fetchTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      fetchTransactions: state.fetchTransactions,
    }))
  );

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const { stats, omzetData, categoryDetails } = useMemo(() => {
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

    const dayMap = {};
    const today = new Date();
    // last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dateKey = d.toDateString();
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      dayMap[dateKey] = { day: dayName, food: 0, beverage: 0, dessert: 0 };
    }

    transactions.forEach((tx) => {
      totalOmzet += tx.total;

      const txDate = new Date(tx.created_at);
      const dateKey = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate()).toDateString();
      const dayRecord = dayMap[dateKey];

      tx.items.forEach((item) => {
        allMenuOrders += item.quantity;
        const cat = item.product_category;
        
        if (cat === "food") foodsCount += item.quantity;
        if (cat === "beverage") beveragesCount += item.quantity;
        if (cat === "dessert") dessertsCount += item.quantity;

        if (cat) {
            categoryItemSales[cat][item.product_title] = (categoryItemSales[cat][item.product_title] || 0) + item.quantity;
            if (dayRecord) {
              dayRecord[cat] += Number(item.subtotal_item);
            }
        }
      });
    });

    const omzetDataArr = Object.values(dayMap);

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

    return { stats: computedStats, omzetData: omzetDataArr, categoryDetails: computedCategoryDetails };
  }, [transactions]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

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

  return (
    <DashboardLayout sidebarProps={{ activeItem: "dashboard" }}>
      <section className="min-h-full bg-[#F7F7F7] px-6 py-6 max-lg:px-4 max-lg:py-4 xl:px-8 xl:py-7">
        <div className="flex items-center justify-between gap-3 max-lg:flex-col max-lg:items-start">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#242424] max-lg:text-[26px]">
            Dashboard
          </h1>
          <p className="text-base text-[#757575]">
            Today, Rabu, 8 April 2026
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 max-lg:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-6">
          {stats.map((stat) => (
            <StatCardComponent
              key={stat.label}
              {...stat}
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
              <FilterField
                placeholder="Start date"
                icon={PiCalendarBlankLight}
              />
              <FilterField
                placeholder="Finish date"
                icon={PiCalendarBlankLight}
              />
              <FilterField
                placeholder="Select Category"
                suffixIcon={PiCaretDownLight}
              />
            </div>
          </div>

          <div className="mt-7 h-[400px] w-full max-lg:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={omzetData}
                margin={{ top: 10, right: 10, left: -16, bottom: 0 }}
                barCategoryGap={18}
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
                  tick={{ fill: "#9C9C9C", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9C9C9C", fontSize: 12 }}
                  tickFormatter={formatAxisTick}
                  domain={[0, 300000]}
                  ticks={[0, 50000, 100000, 150000, 200000, 250000, 300000]}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E6EAF2",
                    boxShadow: "0 10px 25px rgba(25,45,88,0.08)",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "18px" }}
                  iconType="square"
                  formatter={(value) => (
                    <span className="text-sm text-[#4A4A4A]">{value}</span>
                  )}
                />
                <Bar
                  dataKey="food"
                  name="Food"
                  fill="#1C49A6"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="beverage"
                  name="Beverage"
                  fill="#3572EF"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="dessert"
                  name="Dessert"
                  fill="#C2D4FA"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
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

