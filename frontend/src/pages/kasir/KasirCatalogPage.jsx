import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  PiArrowUpRightLight,
  PiBookmarkSimpleLight,
  PiBasketLight,
  PiBowlFoodLight,
  PiCaretDownLight,
  PiCoffeeLight,
  PiCookieLight,
  PiGearSixLight,
  PiMinusCircleLight,
  PiReceiptLight,
  PiPencilSimpleLineLight,
  PiPlusCircleLight,
  PiShoppingCartSimpleLight,
  PiTrashLight,
  PiXLight,
} from "react-icons/pi";
import CashierOrderArchiveControl from "../../features/cashier-order-archive/components/CashierOrderArchiveControl";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useProductsStore } from "../../stores/productsStore";
import { useTransactionsStore } from "../../stores/transactionsStore";
import { useArchiveStore } from "../../stores/archiveStore";
import LoadingSpinner from "../../components/LoadingSpinner";
import SkeletonCard from "../../components/SkeletonCard";
import DocumentTitle from "../../components/DocumentTitle";

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

const itemsSubtotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const createOrderNumber = () => `ORDR#${Date.now().toString().slice(-10)}`;
const cartKey = (menuId, note) => `${menuId}-${note.trim().toLowerCase()}`;

const KasirCatalogPage = () => {
  const addArchive = useArchiveStore((state) => state.addArchive);
  const { products: menus, fetchProducts, isLoading } = useProductsStore(
    useShallow((state) => ({
      products: state.products,
      fetchProducts: state.fetchProducts,
      isLoading: state.isLoading
    }))
  );
  const { createTransaction, isSubmitting } = useTransactionsStore(
    useShallow((state) => ({
      createTransaction: state.createTransaction,
      isSubmitting: state.isSubmitting
    }))
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);
  
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
  const [receiptData, setReceiptData] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredMenus = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    return menus.filter((menu) => {
      const matchCategory =
        activeCategory === "all" || menu.category === activeCategory;
      const matchKeyword =
        keyword.length === 0 ||
        menu.title?.toLowerCase().includes(keyword) ||
        menu.description?.toLowerCase().includes(keyword) ||
        categoryMap[menu.category]?.label.toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [activeCategory, searchValue, menus]);

  const subTotal = useMemo(() => itemsSubtotal(cartItems), [cartItems]);
  const tax = subTotal > 0 ? TAX_AMOUNT : 0;
  const total = subTotal + tax;
  const explicitNominal = selectedNominal || parseNominalInput(customNominal) || 0;
  const isSufficientFunds = explicitNominal === 0 || explicitNominal >= total;
  const amountPaid = explicitNominal || total;
  const isEmpty = cartItems.length === 0;
  
  const totalItemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const hasIdentity = customerName.trim().length > 0;
  const hasTable = orderType === ORDER_TYPE.TAKE_AWAY || tableNumber !== "";
  
  // The button only greys out if there are zero items in the cart or submitting.
  const canPay = !isEmpty && !isSubmitting;

  const addToCart = (menu, note = "") => {
    const finalNote = note.trim();
    const key = cartKey(menu.uuid, finalNote);
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
          menuId: menu.uuid,
          name: menu.title,
          image: menu.image || DEFAULT_IMAGE,
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
    setCartItems(order.cartItems || []);
    const nextNominal = order.amountPaid || 0;
    setSelectedNominal(nextNominal);
    setCustomNominal(nextNominal ? formatNominalInput(String(nextNominal)) : "");
  };

  const handleSaveToArchive = () => {
    if (cartItems.length === 0 && !customerName) {
      alert("Order is empty, nothing to archive.");
      return;
    }
    
    addArchive({
      id: Date.now().toString(),
      orderNumber,
      orderType,
      customerName,
      tableNumber,
      cartItems,
      amountPaid: explicitNominal
    });
    
    setCartItems([]);
    setCustomerName("");
    setTableNumber("");
    setSelectedNominal(0);
    setCustomNominal("");
    setOrderNumber(createOrderNumber());
  };

  const submitPay = async () => {
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
    
    try {
      const payload = {
        order_type: orderType,
        customer_name: customerName.trim(),
        table_number: orderType === ORDER_TYPE.DINE_IN ? Number(tableNumber) : null,
        amount_paid: paid,
        items: cartItems.map((item) => ({
          product_uuid: item.menuId,
          quantity: item.quantity,
          notes: item.note || "",
        })),
      };

      const result = await createTransaction(payload);

      setReceiptData({
        orderNumber: result.order_number || orderNumber,
        orderType: result.order_type,
        customerName: result.customer_name,
        tableNumber: result.table_number,
        createdAt: result.created_at,
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
    } catch (error) {
      console.error(error);
      alert(error?.message || "Unable to complete the transaction right now.");
    }
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
          {
            id: "settings",
            icon: PiGearSixLight,
            label: "Settings",
            href: "/kasir/settings",
          },
        ],
      }}
      topbarProps={{
        searchValue,
        onSearchChange: setSearchValue,
        searchPlaceholder: "Enter the keyword here...",
        beforeProfile: <CashierOrderArchiveControl onRestore={restoreArchiveOrder} />,
      }}
    >
      <DocumentTitle title="Katalog Kasir" />
      <section className="relative min-h-full bg-[#F7F7F7] px-6 py-6 max-lg:px-4 max-lg:py-4 xl:px-8 xl:py-7">
        <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_340px] gap-5 max-lg:grid-cols-1 xl:h-[calc(100vh-120px)] xl:grid-cols-[minmax(0,1fr)_430px]">
          <div className="flex min-h-0 flex-col">
            <div className="grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-lg:gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex h-[46px] items-center justify-center gap-2 rounded-[10px] border px-4 text-[15px] font-medium transition ${isActive
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

            <div className="mt-3 overflow-y-auto scrollbar-hide pr-1 max-lg:pr-0 xl:min-h-0 xl:flex-1">
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 xl:grid-cols-4">
                  {[...Array(8)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 xl:grid-cols-4">
                  {filteredMenus.map((menu) => {
                    const category = categoryMap[menu.category];
                    const isSelected = cartItems.some((item) => item.menuId === menu.uuid);
                    return (
                      <article
                        key={menu.uuid}
                        role="button"
                      tabIndex={0}
                      onClick={() => addToCart(menu)}
                      onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            addToCart(menu);
                          }
                        }}
                        className={`flex min-h-[208px] cursor-pointer flex-col rounded-[10px] border bg-white p-3 shadow-[0_8px_24px_rgba(25,45,88,0.05)] transition 2xl:min-h-[214px] ${
                          isSelected
                            ? "border-[#3572EF] shadow-[0_14px_36px_rgba(53,114,239,0.18)]"
                            : "border-transparent hover:-translate-y-0.5 hover:border-[#DCE5FF]"
                        }`}
                      >
                        <div className="relative overflow-hidden rounded-[10px]">
                          <img
                            src={menu.image}
                            alt={menu.title}
                            loading="lazy"
                            className="h-[116px] w-full object-cover 2xl:h-[120px]"
                          />
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#3572EF] px-3.5 py-1.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(53,114,239,0.24)]">
                            {category?.shortLabel ?? "Menu"}
                          </span>
                        </div>

                        <div className="mt-3 flex min-h-0 min-w-0 flex-1 flex-col 2xl:mt-3">
                          <h2 className="line-clamp-1 break-words text-[17px] font-semibold leading-[1.25] tracking-[-0.03em] text-[#161616] 2xl:text-[18px]">
                            {menu.title}
                          </h2>
                          <p className="mt-1.5 min-h-[40px] overflow-hidden break-words line-clamp-2 text-[13px] leading-[1.45] text-[#A0A0A0] 2xl:mt-1.5 2xl:min-h-[38px] 2xl:text-[13px] 2xl:leading-[1.5]">
                            {menu.description}
                          </p>

                          <div className="mt-auto flex items-end justify-between gap-3 pt-1 2xl:pt-3">
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-[#3572EF] 2xl:text-[14px]">
                                {formatCurrency(menu.price)}
                                <span className="ml-1 font-normal text-[#B1B1B1]">/portion</span>
                              </p>
                              <p className="mt-1 text-[12px] text-[#8F8F8F]">Stock {menu.quantity}</p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Open ${menu.title} detail`}
                              onClick={(event) => {
                                event.stopPropagation();
                                setDetailMenu(menu);
                                setDetailNote("");
                              }}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition 2xl:h-8 2xl:w-8 ${
                                isSelected
                                  ? "border-[#3572EF] bg-[#3572EF] text-white"
                                  : "border-[#D8DDEA] text-[#6A6A6A] hover:border-[#B6C7FF] hover:text-[#3572EF]"
                              }`}
                            >
                              <PiArrowUpRightLight className="text-[14px] 2xl:text-[16px]" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <aside
            className={`transition-all duration-300 lg:block lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[10px] lg:bg-white lg:px-5 lg:py-5 lg:shadow-[0_12px_30px_rgba(25,45,88,0.04)] ${
              isCartOpen
                ? "fixed inset-0 z-50 flex flex-col bg-white lg:static lg:bg-transparent"
                : "hidden"
            } lg:block`}
          >
            <div className="flex-1 min-h-0">
              <div className="flex h-full min-h-0 flex-col rounded-none bg-white p-6 md:p-8 lg:h-auto lg:min-h-fit lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#171717]">List Pesanan</h2>
                <p className="mt-1 text-xs text-[#A2A2A2]">
                  No Order <span className="font-semibold text-[#8A8A8A]">ORDR#{orderNumber.replace(/[^0-9]/g, '') || '1234567890'}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Save order"
                  onClick={handleSaveToArchive}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#3572EF] text-[#3572EF] hover:bg-[#F0F5FF] transition"
                >
                  <PiBookmarkSimpleLight className="text-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#EDEDED] text-[#5E5E5E] transition lg:hidden"
                >
                  <PiXLight className="text-[18px]" />
                </button>
              </div>
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
                    name="customerName"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer Name"
                    className="h-9 w-full rounded-[10px] border border-[#D6D6D6] px-3 text-[14px] text-[#2B2B2B] placeholder:text-[#BFBFBF] outline-none transition focus:border-[#C2D4FA]"
                  />
                </label>

                {orderType === ORDER_TYPE.DINE_IN ? (
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] text-[#5E5E5E]">
                      No.Table
                    </span>
                    <div className="relative">
                      <select
                        name="tableNumber"
                        value={tableNumber}
                        onChange={(event) => setTableNumber(event.target.value)}
                        className="h-9 w-full appearance-none rounded-[10px] border border-[#D6D6D6] px-3 text-[14px] text-[#2B2B2B] outline-none transition focus:border-[#C2D4FA]"
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
              <div className="mt-4 flex min-h-0 flex-1 flex-col lg:block">
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-[20px] text-[#909090]">No Menu Selected</p>
                </div>
                <div className="mt-4 border-t border-[#EFEFEF] pt-4">
                  <button
                    type="button"
                    disabled
                    className="h-11 w-full rounded-[10px] bg-[#B6B6B8] text-[16px] font-medium text-[#ECECEC]"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex min-h-0 flex-1 flex-col lg:block">
                <div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-hide lg:flex-none lg:overflow-visible lg:pr-0">
                  <div className="space-y-5">
                    {cartItems.map((item) => (
                      <article key={item.id} className="flex gap-3 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
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
                              className="flex shrink-0 h-[26px] w-[26px] items-center justify-center rounded-[10px] border border-[#FFD4D4] text-[#FF3333] transition hover:bg-[#FFF3F3]"
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
                                  const menuLookup = menus.find((m) => m.uuid === item.menuId);
                                  if (menuLookup) {
                                    setEditCartItemId(item.id);
                                    setDetailMenu(menuLookup);
                                    setDetailNote(item.note || "");
                                  }
                                }}
                                className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[10px] border border-[#3572EF] text-[#3572EF] transition hover:bg-[#F0F5FF]"
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

                <div className="mt-4 border-t border-[#EFEFEF] pt-4">
                  <div className="relative rounded-[10px] bg-[#F7F7F7] pb-4 pt-4">
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
                            className={`h-[36px] rounded-[10px] border text-[13px] transition ${isActive
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
                      name="customNominal"
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
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Pay"
                    )}
                  </button>
                </div>
              </div>
            )}
              </div>
            </div>
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
            className="w-full max-w-[320px] rounded-[10px] bg-white shadow-[0_24px_64px_rgba(17,24,39,0.2)]"
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
                alt={detailMenu.title}
                className="h-[130px] w-full rounded-[10px] object-cover"
              />
              <span className="mt-2.5 inline-flex rounded-full bg-[#3572EF] px-2 py-0.5 text-[10px] text-white">
                {categoryMap[detailMenu.category]?.shortLabel ?? "Food"}
              </span>
              <h4 className="mt-1.5 text-[16px] font-semibold text-[#151515]">
                {detailMenu.title}
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
                    name="menuNote"
                    value={detailNote}
                    onChange={(event) => setDetailNote(event.target.value)}
                    placeholder="Add note here..."
                    rows={2}
                    className="w-full rounded-[10px] bg-[#F7F7F7] px-3.5 py-2.5 text-[13px] text-[#2A2A2A] outline-none placeholder:text-[#B2B2B2]"
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
                className={`mt-3 h-[40px] w-full rounded-[10px] text-[14px] font-medium transition ${detailNote.trim()
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

      {receiptData ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(31,41,55,0.28)] px-4"
          onClick={() => setReceiptData(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[340px] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[10px] bg-white px-5 py-6 shadow-[0_22px_60px_rgba(17,24,39,0.2)]"
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
              className="mx-auto mt-5 flex h-[40px] w-full items-center justify-center rounded-[10px] bg-[#3572EF] text-[14px] font-medium text-white transition hover:brightness-105"
            >
              Print Struk
            </button>
          </div>
        </div>
      ) : null}

      {/* Floating Cart Button */}
      {!isCartOpen && (
        <div className="fixed bottom-24 right-6 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#3572EF] text-white shadow-[0_12px_28px_rgba(53,114,239,0.35)] transition active:scale-95"
          >
            <PiShoppingCartSimpleLight className="text-[28px]" />
            {totalItemsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-[#FF3333] px-1 text-[12px] font-bold text-white shadow-sm">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default KasirCatalogPage;
