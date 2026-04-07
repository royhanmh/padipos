import { createElement, useState } from "react";
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

const stats = [
  {
    label: "Total Orders",
    value: "500",
    icon: PiReceiptLight,
  },
  {
    label: "Total Omzet",
    value: "Rp 10.000.000",
    icon: PiCoinsLight,
  },
  {
    label: "All Menu Orders",
    value: "1000",
    icon: PiNotebookLight,
  },
  {
    label: "Foods",
    value: "500",
    icon: PiBowlFoodLight,
    accent: true,
    categoryKey: "food",
  },
  {
    label: "Beverages",
    value: "300",
    icon: PiCoffeeLight,
    accent: true,
    categoryKey: "beverage",
  },
  {
    label: "Desserts",
    value: "200",
    icon: PiCookieLight,
    accent: true,
    categoryKey: "dessert",
  },
];

const omzetData = [
  { day: "Mon", food: 20_000, beverage: 150_000, dessert: 15_000 },
  { day: "Tue", food: 30_000, beverage: 100_000, dessert: 5_000 },
  { day: "Wed", food: 50_000, beverage: 245_000, dessert: 18_000 },
  { day: "Thu", food: 70_000, beverage: 150_000, dessert: 45_000 },
  { day: "Fri", food: 95_000, beverage: 200_000, dessert: 8_000 },
  { day: "Sat", food: 50_000, beverage: 150_000, dessert: 30_000 },
  { day: "Sun", food: 22_000, beverage: 100_000, dessert: 6_000 },
  { day: "Mon", food: 48_000, beverage: 150_000, dessert: 18_000 },
  { day: "Tue", food: 48_000, beverage: 250_000, dessert: 16_000 },
  { day: "Wed", food: 18_000, beverage: 150_000, dessert: 45_000 },
];

const categoryDetails = {
  food: {
    title: "Foods",
    items: [
      { name: "Gado-gado Spesial", totalSales: 10 },
      { name: "Ketoprak", totalSales: 5 },
      { name: "Siomay", totalSales: 3 },
      { name: "Batagor", totalSales: 2 },
      { name: "Bakso", totalSales: 2 },
      { name: "Mie Ayam", totalSales: 2 },
      { name: "Soto Ayam", totalSales: 1 },
      { name: "Soto Sapi", totalSales: 0 },
    ],
  },
  beverage: {
    title: "Beverages",
    items: [
      { name: "Ice Tea", totalSales: 10 },
      { name: "Coffee", totalSales: 5 },
      { name: "Matcha Latte", totalSales: 3 },
      { name: "Milkshake", totalSales: 2 },
      { name: "Juice", totalSales: 2 },
      { name: "Ice Chocolate", totalSales: 2 },
      { name: "Soda", totalSales: 1 },
      { name: "Mineral Water", totalSales: 0 },
    ],
  },
  dessert: {
    title: "Desserts",
    items: [
      { name: "Ice Cream", totalSales: 10 },
      { name: "Smothie", totalSales: 5 },
      { name: "Waffle", totalSales: 3 },
      { name: "Donut", totalSales: 2 },
      { name: "Tiramisu", totalSales: 2 },
      { name: "Brownies", totalSales: 2 },
      { name: "Pancake", totalSales: 1 },
      { name: "Pudding", totalSales: 0 },
    ],
  },
};

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
      className="flex h-12 min-w-48 items-center justify-between rounded-xl border border-[#E9E9E9] bg-white px-4 text-sm text-[#B8B8B8] md:min-w-52 md:px-5 md:text-base"
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
      <section className="min-h-full bg-[#F7F7F7] px-5 py-5 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#242424] md:text-[28px]">
            Dashboard
          </h1>
          <p className="text-base text-[#757575]">
            Today, Senin 30 September 2024
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
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

        <section className="mt-5 rounded-xl border border-[#ECECEC] bg-white p-6 shadow-[0_12px_32px_rgba(25,45,88,0.05)] md:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[#242424] md:text-[28px]">
              Total Omzet
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

          <div className="mt-7 h-[380px] w-full md:h-[400px]">
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
              className="w-full max-w-105 rounded-xl bg-white shadow-[0_24px_60px_rgba(17,24,39,0.18)] md:max-w-[500px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#EFEFEF] px-5 py-4">
                <h3 className="text-[32px] font-semibold tracking-[-0.03em] text-[#212121] md:text-[34px]">
                  {activeDetail.title}
                </h3>
                <button
                  type="button"
                  aria-label="Close popup"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#646464] transition hover:bg-[#F6F6F6] md:h-10 md:w-10"
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
                    className="h-11 w-full rounded-xl border border-[#E9E9E9] bg-white pl-10 pr-4 text-base text-[#4B4B4B] outline-none placeholder:text-[#D0D0D0] focus:border-[#C8D8FF] md:h-12 md:pl-11"
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

