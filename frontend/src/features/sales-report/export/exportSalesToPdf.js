import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

export const exportSalesToPdf = (rows, filters, exportConfig = {}) => {
  const {
    title = "Sales Report",
    filenamePrefix = "sales-report",
    cashierName,
  } = exportConfig;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  doc.setFontSize(18);
  doc.text(title, 40, 42);

  doc.setFontSize(10);
  const metadata = [
    `Generated At: ${formatGeneratedAt()}`,
    `Start Date: ${formatFilterDate(filters.startDate)}`,
    `Finish Date: ${formatFilterDate(filters.finishDate)}`,
    `Category: ${formatFilterValue(filters.category, CATEGORY_OPTIONS)}`,
    `Order Type: ${formatFilterValue(filters.orderType, ORDER_TYPE_OPTIONS)}`,
    ...(cashierName ? [`Cashier: ${cashierName}`] : []),
    `Total Rows: ${rows.length}`,
  ];

  metadata.forEach((text, index) => {
    doc.text(text, 40, 68 + index * 14);
  });

  autoTable(doc, {
    startY: 160,
    head: [
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
    ],
    body: rows.map((row) => [
      row.orderNumber,
      formatSalesOrderDate(row.orderDate),
      getOrderTypeLabel(row.orderType),
      getCategoryLabel(row.category),
      row.customerName,
      formatCurrency(row.subTotal),
      formatCurrency(row.tax),
      formatCurrency(row.total),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [77, 124, 254],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      valign: "middle",
      lineColor: [232, 232, 232],
      lineWidth: 0.4,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 253],
    },
    margin: {
      left: 40,
      right: 40,
      bottom: 28,
    },
  });

  const filename = `${filenamePrefix}-${createExportTimestamp()}.pdf`;
  doc.save(filename);
};
