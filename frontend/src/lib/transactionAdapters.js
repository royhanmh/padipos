const DEFAULT_RECEIPT_IMAGE = "/images/food.png";

export const formatDisplayOrderNumber = (orderNumber) => `ORDR#${orderNumber}`;

export const toReceiptData = (transaction) => ({
  id: transaction.uuid,
  orderNumber: formatDisplayOrderNumber(transaction.order_number),
  orderType: transaction.order_type,
  customerName: transaction.customer_name,
  tableNumber: transaction.table_number,
  createdAt: transaction.created_at,
  subTotal: transaction.subtotal,
  tax: transaction.tax,
  total: transaction.total,
  amountPaid: transaction.amount_paid,
  change: transaction.change,
  items: (transaction.items ?? []).map((item) => ({
    id: item.uuid,
    name: item.product_title,
    price: item.unit_price,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    note: item.notes,
    image: DEFAULT_RECEIPT_IMAGE,
    menuId: item.product_uuid,
  })),
});

export const toReportOrder = (transaction) => ({
  id: transaction.uuid,
  uuid: transaction.uuid,
  orderNumber: formatDisplayOrderNumber(transaction.order_number),
  orderDate: transaction.created_at,
  orderType: transaction.order_type,
  category: transaction.display_category,
  categories: transaction.categories ?? [],
  customerName: transaction.customer_name,
  tableNumber: transaction.table_number,
  subTotal: transaction.subtotal,
  tax: transaction.tax,
  total: transaction.total,
  amountPaid: transaction.amount_paid,
  change: transaction.change,
  cashierName: transaction.cashier?.username ?? "-",
  items: (transaction.items ?? []).map((item) => ({
    id: item.uuid,
    name: item.product_title,
    unitPrice: item.unit_price,
    quantity: item.quantity,
    note: item.notes,
    category: item.product_category,
    productUuid: item.product_uuid,
  })),
});

export const toReportOrders = (transactions) =>
  (transactions ?? []).map(toReportOrder);
