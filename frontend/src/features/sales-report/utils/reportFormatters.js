const WEEKDAY_SHORT_LABELS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Category" },
  { value: "food", label: "Foods" },
  { value: "beverage", label: "Beverages" },
  { value: "dessert", label: "Desserts" },
];

export const ORDER_TYPE_OPTIONS = [
  { value: "all", label: "All Order Type" },
  { value: "dine-in", label: "Dine-in" },
  { value: "take-away", label: "Take Away" },
];

const CATEGORY_LABEL_MAP = {
  food: "Foods",
  beverage: "Beverages",
  dessert: "Desserts",
  mixed: "Mixed",
};

const ORDER_TYPE_LABEL_MAP = ORDER_TYPE_OPTIONS.reduce((collection, item) => {
  if (item.value !== "all") {
    collection[item.value] = item.label;
  }

  return collection;
}, {});

const pad2 = (value) => String(value).padStart(2, "0");

export const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const getCategoryLabel = (value) => CATEGORY_LABEL_MAP[value] ?? value;

export const getOrderTypeLabel = (value) =>
  ORDER_TYPE_LABEL_MAP[value] ?? value;

export const formatSalesOrderDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const weekday = WEEKDAY_SHORT_LABELS[date.getDay()];
  const day = pad2(date.getDate());
  const month = pad2(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${weekday}, ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatFilterDate = (value) => {
  if (!value) {
    return "All";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return "All";
  }

  return `${day}/${month}/${year}`;
};

export const formatTodayLabel = () => {
  const formatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return `Today, ${formatted.replace(/, /g, " ")}`;
};

export const formatGeneratedAt = (date = new Date()) => {
  const day = pad2(date.getDate());
  const month = pad2(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const createExportTimestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export const formatFilterValue = (value, options) => {
  const match = options.find((option) => option.value === value);
  return match?.label ?? "All";
};
