import SalesReportView from "../../features/sales-report/components/SalesReportView";
import { MOCK_SALES_ORDERS } from "../../features/sales-report/data/mockSalesOrders";

const SalesReportPage = () => {
  return (
    <SalesReportView
      orders={MOCK_SALES_ORDERS}
      pageTitle="Sales Report"
      layoutSidebarProps={{ activeItem: "orders" }}
      exportConfig={{
        title: "Sales Report",
        filenamePrefix: "sales-report",
      }}
    />
  );
};

export default SalesReportPage;
