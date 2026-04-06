import * as XLSX from "xlsx";
import {
  CATEGORY_OPTIONS,
  ORDER_TYPE_OPTIONS,
  createExportTimestamp,
  formatCurrency,
  formatFilterDate,
  formatFilterValue,
  formatGeneratedAt,
  formatSalesOrderDate,
  getCategoryLabel,
  getOrderTypeLabel,
} from "../utils/reportFormatters";

export const exportSalesToExcel = (rows, filters, exportConfig = {}) => {
  const {
    title = "Sales Report",
    filenamePrefix = "sales-report",
    cashierName,
  } = exportConfig;

  const worksheetData = [
    [title],
    ["Generated At", formatGeneratedAt()],
    ["Start Date", formatFilterDate(filters.startDate)],
    ["Finish Date", formatFilterDate(filters.finishDate)],
    ["Category", formatFilterValue(filters.category, CATEGORY_OPTIONS)],
    ["Order Type", formatFilterValue(filters.orderType, ORDER_TYPE_OPTIONS)],
    ...(cashierName ? [["Cashier", cashierName]] : []),
    ["Total Rows", rows.length],
    [],
    [
      "No Order",
      "Order Date",
      "Order Type",
      "Category",
      "Customer Name",
      "Sub Total",
      "Tax",
      "Total",
    ],
    ...rows.map((row) => [
      row.orderNumber,
      formatSalesOrderDate(row.orderDate),
      getOrderTypeLabel(row.orderType),
      getCategoryLabel(row.category),
      row.customerName,
      formatCurrency(row.subTotal),
      formatCurrency(row.tax),
      formatCurrency(row.total),
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 14 },
    { wch: 14 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  const filename = `${filenamePrefix}-${createExportTimestamp()}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
