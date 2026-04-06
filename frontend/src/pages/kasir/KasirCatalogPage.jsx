import { useMemo, useState } from "react";
import {
  PiArrowCircleRightLight,
  PiArrowUpRightLight,
  PiBookmarkSimpleLight,
  PiBasketLight,
  PiBowlFoodLight,
  PiCaretDownLight,
  PiCoffeeLight,
  PiCookieLight,
  PiGearSixLight,
  PiMagnifyingGlassLight,
  PiMinusCircleLight,
  PiReceiptLight,
  PiPencilSimpleLineLight,
  PiPlusCircleLight,
  PiTrashLight,
  PiXLight,
} from "react-icons/pi";
import DashboardLayout from "../../layouts/DashboardLayout";

const ORDER_TYPE = { DINE_IN: "dine-in", TAKE_AWAY: "take-away" };
const TAX_AMOUNT = 5000;
const NOMINAL_OPTIONS = [50000, 75000, 100000];
const TABLE_OPTIONS = ["01", "02", "03", "04", "05", "06"];
const DEFAULT_IMAGE = "/images/food.png";

const categories = [
  { id: "all", label: "All Menu" },
  { id: "food", label: "Foods", shortLabel: "Food", icon: PiBowlFoodLight },
  {
    id: "beverage",
    label: "Beverages",
    shortLabel: "Beverage",
    icon: PiCoffeeLight,
  },
  {
    id: "dessert",
    label: "Dessert",
    shortLabel: "Dessert",
    icon: PiCookieLight,
  },
];

const categoryMap = categories.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

const menus = [
  {
    id: 1,
    name: "Gado-gado Spesial",
    category: "food",
    description:
      "Vegetables, egg, tempe, tofu, ketupat, peanut sauce, and kerupuk.",
    price: 20000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 2,
    name: "Crispy chicken sambal",
    category: "food",
    description: "Crispy chicken, green sambal, cucumber, and warm rice.",
    price: 28000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 3,
    name: "Savory fried rice",
    category: "food",
    description: "Savory fried rice with shredded chicken, egg and crackers.",
    price: 25000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 4,
    name: "Grilled chicken satay",
    category: "food",
    description: "Grilled chicken satay with peanut glaze and lontong.",
    price: 32000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 5,
    name: "Kopi Susu Aren",
    category: "beverage",
    description: "Espresso, palm sugar milk, and creamy foam.",
    price: 18000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 6,
    name: "Matcha Latte",
    category: "beverage",
    description: "Earthy matcha with chilled milk and silky texture.",
    price: 22000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 7,
    name: "Banana Caramel Cake",
    category: "dessert",
    description: "Soft banana sponge with caramel cream topping.",
    price: 24000,
    image: DEFAULT_IMAGE,
  },
  {
    id: 8,
    name: "Chocolate Lava Cup",
    category: "dessert",
    description: "Warm chocolate center with vanilla cream.",
    price: 23000,
    image: DEFAULT_IMAGE,
  },
];

const archiveOrders = [
  {
    id: "arc-1",
    orderNumber: "ORDR#1234567890",
    orderType: ORDER_TYPE.DINE_IN,
    customerName: "Anisa",
    tableNumber: "01",
    createdAt: "2024-09-30T12:30:00",
    amountPaid: 100000,
    items: [
      {
        id: "arc-1-item-1",
        menuId: 1,
        name: "Gado-gado Spesial",
        price: 20000,
        quantity: 2,
        note: "Without egg and tofu",
        image: DEFAULT_IMAGE,
      },
      {
        id: "arc-1-item-2",
        menuId: 3,
        name: "Savory fried rice",
        price: 25000,
        quantity: 1,
        note: "",
        image: DEFAULT_IMAGE,
      },
    ],
  },
  {
    id: "arc-2",
    orderNumber: "ORDR#1234567891",
    orderType: ORDER_TYPE.TAKE_AWAY,
    customerName: "Rio",
    tableNumber: "",
    createdAt: "2024-09-29T18:15:00",
    amountPaid: 65000,
    items: [
      {
        id: "arc-2-item-1",
        menuId: 4,
        name: "Grilled chicken satay",
        price: 32000,
        quantity: 1,
        note: "",
        image: DEFAULT_IMAGE,
      },
      {
        id: "arc-2-item-2",
        menuId: 5,
        name: "Kopi Susu Aren",
        price: 18000,
        quantity: 1,
        note: "",
        image: DEFAULT_IMAGE,
      },
    ],
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatNominalInput = (value) => {
  const onlyDigits = value.replace(/\D/g, "");
  if (!onlyDigits) return "";
  return new Intl.NumberFormat("id-ID").format(Number(onlyDigits));
};

const parseNominalInput = (value) => {
  const onlyDigits = value.replace(/\D/g, "");
  return onlyDigits ? Number(onlyDigits) : 0;
};

const pad = (value) => String(value).padStart(2, "0");

const formatReceiptDateTime = (value) => {
  const date = new Date(value);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return `${days[date.getDay()]}, ${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

const formatArchiveDateTime = (value) => {
  const date = new Date(value);
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const itemsSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const createOrderNumber = () => `ORDR#${Date.now().toString().slice(-10)}`;
const cartKey = (menuId, note) => `${menuId}-${note.trim().toLowerCase()}`;

const KasirCatalogPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [orderType, setOrderType] = useState(ORDER_TYPE.DINE_IN);
  const [orderNumber, setOrderNumber] = useState(createOrderNumber);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [customNominal, setCustomNominal] = useState("");
  const [detailMenu, setDetailMenu] = useState(null);
  const [detailNote, setDetailNote] = useState("");
  const [editCartItemId, setEditCartItemId] = useState(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [archiveSearchDraft, setArchiveSearchDraft] = useState("");
  const [archiveTypeDraft, setArchiveTypeDraft] = useState("all");
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveType, setArchiveType] = useState("all");
  const [receiptData, setReceiptData] = useState(null);

  const filteredMenus = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return menus.filter((menu) => {
      const matchCategory =
        activeCategory === "all" || menu.category === activeCategory;
      const matchKeyword =
        keyword.length === 0 ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.description.toLowerCase().includes(keyword) ||
        categoryMap[menu.category]?.label.toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [activeCategory, searchValue]);

  const filteredArchiveOrders = useMemo(() => {
    const keyword = archiveSearch.trim().toLowerCase();
    return archiveOrders.filter((order) => {
      const matchType = archiveType === "all" || order.orderType === archiveType;
      const matchKeyword =
        keyword.length === 0 ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);
      return matchType && matchKeyword;
    });
  }, [archiveSearch, archiveType]);

  const subTotal = useMemo(() => itemsSubtotal(cartItems), [cartItems]);
  const tax = subTotal > 0 ? TAX_AMOUNT : 0;
  const total = subTotal + tax;
  const explicitNominal = selectedNominal || parseNominalInput(customNominal) || 0;
  const isSufficientFunds = explicitNominal === 0 || explicitNominal >= total;
  const amountPaid = explicitNominal || total;
  const isEmpty = cartItems.length === 0;
  
  const hasIdentity = customerName.trim().length > 0;
  const hasTable = orderType === ORDER_TYPE.TAKE_AWAY || tableNumber !== "";
  
  // The button only greys out if there are zero items in the cart.
  const canPay = !isEmpty;

  const addToCart = (menu, note = "") => {
    const finalNote = note.trim();
    const key = cartKey(menu.id, finalNote);
    setCartItems((prev) => {
      const found = prev.find((item) => item.key === key);
      if (found) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prev,
        {
          id: `${key}-${Date.now()}`,
          key,
          menuId: menu.id,
          name: menu.name,
          image: menu.image,
          price: menu.price,
          quantity: 1,
          note: finalNote,
        },
      ];
    });
  };

  const restoreArchiveOrder = (order) => {
    setOrderType(order.orderType);
    setOrderNumber(order.orderNumber);
    setCustomerName(order.customerName);
    setTableNumber(order.tableNumber || "");
    setCartItems(
      order.items.map((item) => ({
        ...item,
        key: cartKey(item.menuId, item.note || ""),
        id: `${item.id}-${Date.now()}`,
      })),
    );
    const nextNominal = order.amountPaid || 0;
    setSelectedNominal(nextNominal);
    setCustomNominal(nextNominal ? formatNominalInput(String(nextNominal)) : "");
    setIsArchiveOpen(false);
  };

  const submitPay = () => {
    if (!canPay) return;
    
    if (!hasIdentity) {
      alert("Please input the Customer Name before proceeding to checkout.");
      return;
    }
    
    if (!hasTable) {
      alert("Please select a Table Number for Dine-in orders.");
      return;
    }
    
    if (!isSufficientFunds) {
      alert(`Insufficient funds! The customer must pay at least ${formatCurrency(total)}.`);
      return;
    }

    const paid = Math.max(amountPaid, total);
    setReceiptData({
      orderNumber,
      orderType,
      customerName: customerName.trim(),
      tableNumber: tableNumber,
      createdAt: new Date().toISOString(),
      items: cartItems,
      subTotal,
      tax,
      total,
      amountPaid: paid,
      change: paid - total,
    });
    setCartItems([]);
    setCustomerName("");
    setTableNumber("");
    setSelectedNominal(0);
    setCustomNominal("");
    setOrderNumber(createOrderNumber());
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById("receipt-content");
    if (!printContent) return;

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
            .gap-3 { gap: 12px; }
            .font-semibold { font-weight: 600; }
            .mt-1 { margin-top: 4px; }
            .mt-1\\.5 { margin-top: 6px; }
            .mt-2 { margin-top: 8px; }
            .mt-3 { margin-top: 12px; }
            .pt-3 { padding-top: 12px; }
            .pb-2 { padding-bottom: 8px; }
            .px-4 { padding-left: 16px; padding-right: 16px; }
            .py-4 { padding-top: 16px; padding-bottom: 16px; }
            .pb-4 { padding-bottom: 16px; }
            .pt-4 { padding-top: 16px; }
            .border-t { border-top-width: 1px; border-top-style: dashed; border-top-color: #cfcfcf; }
            
            /* Typography */
            .text-\\[11px\\] { font-size: 11px; }
            .text-\\[12px\\] { font-size: 12px; }
            .text-\\[13px\\] { font-size: 13px; }
            .text-\\[14px\\] { font-size: 14px; }
            .text-\\[18px\\] { font-size: 18px; }
            
            /* Fill Colors - we can safely mock these by simply printing black/grey scales physically */
            .text-\\[\\#8E8E8E\\], .text-\\[\\#666666\\], .text-\\[\\#767676\\], .text-\\[\\#6D6D6D\\], .text-\\[\\#585858\\] { color: #555; }
            .text-\\[\\#323232\\], .text-\\[\\#1E1E1E\\], .text-\\[\\#272727\\], .text-\\[\\#2F2F2F\\] { color: #111; }
            
            /* Strip hidden design attributes for physical thermal print */
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

  const listTitle = orderType === ORDER_TYPE.DINE_IN ? "List Order" : "List Pesanan";

  return (
    <DashboardLayout
      sidebarProps={{
        activeItem: "catalog",
        variant: "kasir",
        items: [
          {
            id: "catalog",
            icon: PiBasketLight,
            label: "Catalog",
            href: "/kasir/catalog",
          },
          {
            id: "orders",
            icon: PiReceiptLight,
            label: "Orders",
            href: "/kasir/sales-report",
          },
          { id: "settings", icon: PiGearSixLight, label: "Settings" },
        ],
      }}
      topbarProps={{
        searchValue,
        onSearchChange: setSearchValue,
        searchPlaceholder: "Enter the keyword here...",
        profile: {
          name: "John Doe",
          role: "Cashier",
          image: "/images/UserImage.png",
        },
        beforeProfile: (
          <button
            type="button"
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-2 rounded-xl px-2 py-2 text-base text-[#6B6B6B] transition hover:bg-[#F5F5F5] hover:text-[#3572EF]"
          >
            <PiBookmarkSimpleLight className="text-[18px]" />
            <span>Order Archive</span>
          </button>
        ),
      }}
    >
      <section className="min-h-full bg-[#F7F7F7] px-4 py-4 md:px-5 md:py-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="min-h-0">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex h-[46px] items-center justify-center gap-2 rounded-[12px] border px-4 text-[15px] font-medium transition ${isActive
                        ? "border-[#3572EF] bg-[#3572EF] text-white"
                        : "border-[#BEBEBE] text-[#A9A9A9] hover:border-[#C2D4FA] hover:text-[#5E5E5E] bg-white"
                      }`}
                  >
                    {Icon ? <Icon className="text-[20px]" /> : null}
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-[22px] font-semibold text-[#181818]">List Menu</h1>
              <p className="text-sm text-[#979797]">
                Total <span className="font-medium text-[#515151]">{menus.length}</span> Menu
              </p>
            </div>

            <div className="mt-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMenus.map((menu) => {
                  const isSelected = cartItems.some((item) => item.menuId === menu.id);
                  return (
                    <article
                      key={menu.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => addToCart(menu)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          addToCart(menu);
                        }
                      }}
                      className={`rounded-xl border bg-white p-2.5 shadow-[0_8px_22px_rgba(25,45,88,0.04)] transition ${isSelected
                          ? "border-[#3572EF]"
                          : "border-transparent hover:border-[#C2D4FA]"
                        }`}
                    >
                      <div className="relative overflow-hidden rounded-[10px]">
                        <img
                          src={menu.image}
                          alt={menu.name}
                          className="h-[140px] w-full object-cover rounded-[10px]"
                        />
                        <span className="absolute right-2 top-2 rounded-full bg-[#3572EF] px-2.5 py-0.5 text-xs text-white">
                          {categoryMap[menu.category]?.shortLabel ?? "Menu"}
                        </span>
                      </div>
                      <h2 className="mt-2.5 line-clamp-1 text-[16px] font-semibold text-[#1A1A1A]">
                        {menu.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 min-h-[36px] text-[13px] text-[#A5A5A5] leading-snug">
                        {menu.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-[15px] font-semibold text-[#3572EF]">
                          {formatCurrency(menu.price)}
                          <span className="ml-1 text-xs font-normal text-[#AFAFAF]">/portion</span>
                        </p>
                        <button
                          type="button"
                          aria-label={`Open ${menu.name} detail`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setDetailMenu(menu);
                            setDetailNote("");
                          }}
                          className="flex h-[32px] w-[32px] items-center justify-center rounded-lg border border-[#D3D3D3] text-[#666666] transition hover:border-[#3572EF] hover:text-[#3572EF]"
                        >
                          <PiArrowUpRightLight className="text-[16px]" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="flex flex-col rounded-2xl bg-white px-5 py-5 shadow-[0_12px_30px_rgba(25,45,88,0.04)] lg:sticky lg:top-5 lg:h-fit lg:max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#171717]">List Pesanan</h2>
                <p className="mt-1 text-xs text-[#A2A2A2]">
                  No Order <span className="font-semibold text-[#8A8A8A]">ORDR#{orderNumber.replace(/[^0-9]/g, '') || '1234567890'}</span>
                </p>
              </div>
              <button
                type="button"
                aria-label="Save order"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#3572EF] text-[#3572EF] hover:bg-[#F0F5FF] transition"
              >
                <PiBookmarkSimpleLight className="text-[18px]" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType(ORDER_TYPE.DINE_IN)}
                className={`h-[42px] rounded-[10px] border text-[14px] font-medium transition ${orderType === ORDER_TYPE.DINE_IN
                    ? "border-[#3572EF] bg-[#3572EF] text-white"
                    : "border-[#D6D6D6] bg-white text-[#A8A8A8] hover:border-[#C2D4FA]"
                  }`}
              >
                Dine in
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderType(ORDER_TYPE.TAKE_AWAY);
                  setTableNumber("");
                }}
                className={`h-[42px] rounded-[10px] border text-[14px] font-medium transition ${orderType === ORDER_TYPE.TAKE_AWAY
                    ? "border-[#3572EF] bg-[#3572EF] text-white"
                    : "border-[#D6D6D6] bg-white text-[#A8A8A8] hover:border-[#C2D4FA]"
                  }`}
              >
                Take Away
              </button>
            </div>

            <div className="mt-4 border-b border-[#EDEDED] pb-4">
              <div
                className={`grid gap-3 ${orderType === ORDER_TYPE.DINE_IN
                    ? "grid-cols-2"
                    : "grid-cols-1"
                  }`}
              >
                <label className="block">
                  <span className="mb-1.5 block text-[12px] text-[#5E5E5E]">
                    Customer Name
                  </span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer Name"
                    className="h-9 w-full rounded-[8px] border border-[#D6D6D6] px-3 text-[14px] text-[#2B2B2B] placeholder:text-[#BFBFBF] outline-none transition focus:border-[#C2D4FA]"
                  />
                </label>

                {orderType === ORDER_TYPE.DINE_IN ? (
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-[#5E5E5E]">
                      No.Table
                    </span>
                    <div className="relative">
                      <select
                        value={tableNumber}
                        onChange={(event) => setTableNumber(event.target.value)}
                        className="h-9 w-full appearance-none rounded-[8px] border border-[#D6D6D6] px-3 text-[14px] text-[#2B2B2B] outline-none transition focus:border-[#C2D4FA]"
                      >
                        <option value="">Select No.Table</option>
                        {TABLE_OPTIONS.map((table) => (
                          <option key={table} value={table}>
                            {table}
                          </option>
                        ))}
                      </select>
                      <PiCaretDownLight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#A0A0A0]" />
                    </div>
                  </label>
                ) : null}
              </div>
            </div>

            {isEmpty ? (
              <div className="flex flex-1 flex-col">
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-[20px] text-[#909090]">No Menu Selected</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="h-11 w-full rounded-xl bg-[#B6B6B8] text-[16px] font-medium text-[#ECECEC]"
                >
                  Pay
                </button>
              </div>
            ) : (
              <div className="mt-4 flex min-h-0 flex-1 flex-col">
                <div className="flex-1 min-h-[220px] overflow-y-auto pr-1">
                  <div className="space-y-5">
                    {cartItems.map((item) => (
                      <article key={item.id} className="flex gap-3 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[60px] w-[60px] shrink-0 rounded-[10px] object-cover"
                        />
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="line-clamp-1 text-[15px] font-semibold text-[#1D1D1D]">
                                {item.name}
                              </h3>
                              <p className="mt-0.5 text-[14px] font-medium text-[#444444]">
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove ${item.name}`}
                              onClick={() =>
                                setCartItems((prev) =>
                                  prev.filter((nextItem) => nextItem.id !== item.id),
                                )
                              }
                              className="flex shrink-0 h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#FFD4D4] text-[#FF3333] transition hover:bg-[#FFF3F3]"
                            >
                              <PiTrashLight className="text-[14px]" />
                            </button>
                          </div>
                          
                          <div className="mt-1 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                type="button"
                                aria-label="Add or Edit Note"
                                onClick={() => {
                                  const menuLookup = menus.find((m) => m.id === item.menuId);
                                  if (menuLookup) {
                                    setEditCartItemId(item.id);
                                    setDetailMenu(menuLookup);
                                    setDetailNote(item.note || "");
                                  }
                                }}
                                className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] border border-[#3572EF] text-[#3572EF] transition hover:bg-[#F0F5FF]"
                              >
                                <PiPencilSimpleLineLight className="text-[14px]" />
                              </button>
                              {item.note ? (
                                <p className="truncate text-[12px] leading-tight text-[#8D8D8D]">
                                  {item.note}
                                </p>
                              ) : null}
                            </div>
                            
                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  setCartItems((prev) =>
                                    prev.map((nextItem) =>
                                      nextItem.id === item.id
                                        ? {
                                          ...nextItem,
                                          quantity: Math.max(1, nextItem.quantity - 1),
                                        }
                                        : nextItem,
                                    ),
                                  )
                                }
                                className="text-[#BDBDBD] transition hover:text-[#3572EF]"
                              >
                                <PiMinusCircleLight className="text-[24px]" />
                              </button>
                              <span className="w-[20px] text-center text-[15px] font-medium text-[#252525]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  setCartItems((prev) =>
                                    prev.map((nextItem) =>
                                      nextItem.id === item.id
                                        ? { ...nextItem, quantity: nextItem.quantity + 1 }
                                        : nextItem,
                                    ),
                                  )
                                }
                                className="text-[#3572EF] transition hover:text-[#1C61ED]"
                              >
                                <PiPlusCircleLight className="text-[24px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="relative rounded-[12px] bg-[#F7F7F7] pb-4 pt-4">
                    <div className="px-5">
                      <div className="flex items-center justify-between text-[13px] text-[#737373]">
                        <p>Sub Total</p>
                        <p>{formatCurrency(itemsSubtotal(cartItems))}</p>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[13px] text-[#737373]">
                        <p>Tax</p>
                        <p>{formatCurrency(tax)}</p>
                      </div>
                    </div>
                    
                    <div className="relative mt-5 mb-1 h-px w-full">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-[#DADADA]"></div>
                      </div>
                      <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white"></div>
                      <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white"></div>
                    </div>

                    <div className="px-5 pt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[16px] text-[#383838]">Total</p>
                        <p className="text-[24px] font-bold text-[#1F1F1F]">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[13px] text-[#3D3D3D]">Select Nominal</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {NOMINAL_OPTIONS.map((nominal) => {
                        const isActive = selectedNominal === nominal;
                        return (
                          <button
                            key={nominal}
                            type="button"
                            onClick={() => {
                              setSelectedNominal(nominal);
                              setCustomNominal(formatNominalInput(String(nominal)));
                            }}
                            className={`h-[36px] rounded-[8px] border text-[13px] transition ${isActive
                                ? "border-[#3572EF] bg-[#3572EF] text-white"
                                : "border-[#CCCCCC] text-[#A8A8A8] hover:border-[#3572EF] hover:text-[#3572EF]"
                              }`}
                          >
                            {formatCurrency(nominal)}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={customNominal}
                      onChange={(event) => {
                        setSelectedNominal(0);
                        setCustomNominal(formatNominalInput(event.target.value));
                      }}
                      placeholder="Enter custom nominal here..."
                      className="mt-3 h-[36px] w-full border-b border-[#DCDCDC] bg-transparent px-1 text-center text-[13px] text-[#2F2F2F] placeholder:text-[#B3B3B3] outline-none transition focus:border-[#3572EF]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submitPay}
                    disabled={!canPay}
                    className={`mt-4 h-[44px] w-full rounded-[10px] text-[16px] font-medium transition ${canPay
                        ? "bg-[#3572EF] text-white hover:brightness-105 shadow-[0_4px_12px_rgba(53,114,239,0.2)]"
                        : "bg-[#B6B6B8] text-[#ECECEC]"
                      }`}
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {detailMenu ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setDetailMenu(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[320px] rounded-[20px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECECEC] px-4 py-3">
              <h3 className="w-full text-center text-[16px] font-semibold text-[#1C1C1C]">
                Detail Menu
              </h3>
              <button
                type="button"
                aria-label="Close detail modal"
                onClick={() => {
                  setDetailMenu(null);
                  setEditCartItemId(null);
                }}
                className="text-[#3E3E3E]"
              >
                <PiXLight className="text-[18px]" />
              </button>
            </div>

            <div className="px-4 py-4">
              <img
                src={detailMenu.image}
                alt={detailMenu.name}
                className="h-[130px] w-full rounded-[12px] object-cover"
              />
              <span className="mt-2.5 inline-flex rounded-full bg-[#3572EF] px-2 py-0.5 text-[10px] text-white">
                {categoryMap[detailMenu.category]?.shortLabel ?? "Food"}
              </span>
              <h4 className="mt-1.5 text-[16px] font-semibold text-[#151515]">
                {detailMenu.name}
              </h4>
              <p className="mt-1 text-[12px] leading-snug text-[#8C8C8C]">
                {detailMenu.description}
              </p>

              <p className="mt-1.5 text-[15px] font-semibold text-[#3572EF]">
                {formatCurrency(detailMenu.price)}
                <span className="ml-1 text-[11px] font-normal text-[#9B9B9B]">/portion</span>
              </p>

              <div className="mt-2.5 border-t border-dashed border-[#CFCFCF] pt-2.5">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-[#515151]">
                    Add Note
                  </span>
                  <textarea
                    value={detailNote}
                    onChange={(event) => setDetailNote(event.target.value)}
                    placeholder="Add note here..."
                    rows={2}
                    className="w-full rounded-[8px] bg-[#F7F7F7] px-3.5 py-2.5 text-[13px] text-[#2A2A2A] outline-none placeholder:text-[#B2B2B2]"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!detailNote.trim()) return;
                  if (editCartItemId) {
                    setCartItems((prev) => 
                      prev.map((it) => 
                        it.id === editCartItemId ? { ...it, note: detailNote.trim(), key: cartKey(it.menuId, detailNote.trim()) } : it
                      )
                    );
                  } else {
                    addToCart(detailMenu, detailNote);
                  }
                  
                  setDetailMenu(null);
                  setDetailNote("");
                  setEditCartItemId(null);
                }}
                disabled={!detailNote.trim()}
                className={`mt-3 h-[40px] w-full rounded-[8px] text-[14px] font-medium transition ${detailNote.trim()
                    ? "bg-[#3572EF] text-white hover:bg-[#1C61ED]"
                    : "bg-[#B6B6B8] text-[#ECECEC]"
                  }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isArchiveOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setIsArchiveOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[980px] rounded-[28px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EFEFEF] px-7 py-5">
              <h3 className="text-[44px] font-semibold text-[#171717]">Order Archive</h3>
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
                    <option value={ORDER_TYPE.DINE_IN}>Dine-in</option>
                    <option value={ORDER_TYPE.TAKE_AWAY}>Take Away</option>
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
                      <article key={order.id} className="rounded-xl bg-[#FAFAFA] px-4 py-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[19px] text-[#8C8C8C]">
                              No Order{" "}
                              <span className="text-[#525252]">{order.orderNumber}</span>
                            </p>
                            <p className="mt-1 text-[17px] text-[#2E2E2E]">
                              {order.orderType === ORDER_TYPE.DINE_IN
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
                              onClick={() => restoreArchiveOrder(order)}
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

      {receiptData ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setReceiptData(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[340px] rounded-[20px] bg-white px-5 py-6 shadow-[0_22px_60px_rgba(17,24,39,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close transaction success"
              onClick={() => setReceiptData(null)}
              className="absolute right-4 top-4 text-[#4A4A4A] transition hover:text-[#1B1B1B]"
            >
              <PiXLight className="text-[20px]" />
            </button>

            <h2 className="pt-1 text-center text-[20px] font-semibold tracking-[-0.02em] text-[#111111]">
              Transaction Success
            </h2>

            <div id="receipt-content" className="mx-auto mt-5 w-full">
              <div className="overflow-hidden rounded-t-[10px] bg-[#F3F3F3] px-4 py-4">
                <p className="text-[11px] text-[#8E8E8E]">
                  No Order <span className="text-[#666666]">{receiptData.orderNumber}</span>
                </p>
                <p className="mt-1 text-[11px] text-[#8E8E8E]">
                  Order Date{" "}
                  <span className="text-[#666666]">
                    {formatReceiptDateTime(receiptData.createdAt)}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-[#8E8E8E]">
                  Customer Name{" "}
                  <span className="text-[#666666]">{receiptData.customerName}</span>
                </p>
                <p className="mt-1.5 text-[12px] text-[#323232]">
                  {receiptData.orderType === ORDER_TYPE.DINE_IN
                    ? `Dine-in - No.Meja ${receiptData.tableNumber || "--"}`
                    : "Take Away"}
                </p>

                <div className="mt-3 border-t border-dashed border-[#CFCFCF] pt-3">
                  <div className="space-y-3">
                    {receiptData.items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex items-start justify-between gap-3"
                      >
                        <div>
                          <p className="text-[14px] font-semibold text-[#1E1E1E]">
                            {item.name}
                          </p>
                          <p className="text-[12px] text-[#767676]">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="text-[12px] font-semibold text-[#272727]">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 border-t border-dashed border-[#CFCFCF] pt-3">
                  <div className="flex items-center justify-between text-[12px] text-[#6D6D6D]">
                    <p>Sub Total</p>
                    <p>{formatCurrency(receiptData.subTotal)}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[12px] text-[#6D6D6D]">
                    <p>Tax</p>
                    <p>{formatCurrency(receiptData.tax)}</p>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-dashed border-[#CFCFCF] bg-[#ECECEC] px-4 pb-4 pt-4 rounded-b-[10px]">
                <span
                  aria-hidden="true"
                  className="absolute -left-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full bg-white"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full bg-white"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-[#2F2F2F]">Total</p>
                  <p className="text-[18px] font-semibold text-[#272727]">
                    {formatCurrency(receiptData.total)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] text-[#585858]">
                  <p>Diterima</p>
                  <p>{formatCurrency(receiptData.amountPaid)}</p>
                </div>
                <div className="mt-1.5 flex items-center justify-between pb-2 text-[13px] text-[#585858]">
                  <p>Kembalian</p>
                  <p>{formatCurrency(receiptData.change)}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrintReceipt}
              className="mx-auto mt-5 flex h-[40px] w-full items-center justify-center rounded-[8px] bg-[#3572EF] text-[14px] font-medium text-white transition hover:brightness-105"
            >
              Print Struk
            </button>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default KasirCatalogPage;
