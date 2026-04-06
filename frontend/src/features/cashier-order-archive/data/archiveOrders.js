export const CASHIER_ORDER_TYPES = {
  DINE_IN: "dine-in",
  TAKE_AWAY: "take-away",
};

const DEFAULT_IMAGE = "/images/food.png";

export const CASHIER_ARCHIVE_ORDERS = [
  {
    id: "arc-1",
    orderNumber: "ORDR#1234567890",
    orderType: CASHIER_ORDER_TYPES.DINE_IN,
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
    orderType: CASHIER_ORDER_TYPES.TAKE_AWAY,
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
