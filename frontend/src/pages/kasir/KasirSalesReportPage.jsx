import { useMemo } from "react";
import { PiBasketLight, PiGearSixLight, PiReceiptLight } from "react-icons/pi";
import SalesReportView from "../../features/sales-report/components/SalesReportView";
import { MOCK_SALES_ORDERS } from "../../features/sales-report/data/mockSalesOrders";

const CASHIER_PROFILE = {
  name: "John Doe",
  role: "Cashier",
  image: "/images/UserImage.png",
};

const KasirSalesReportPage = () => {
  const cashierOrders = useMemo(() => {
    return MOCK_SALES_ORDERS.filter(
      (order) => order.cashierName === CASHIER_PROFILE.name,
    );
  }, []);

  return (
    <SalesReportView
      orders={cashierOrders}
      pageTitle="Sales Report"
      layoutSidebarProps={{
        activeItem: "orders",
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
      layoutTopbarProps={{
        profile: CASHIER_PROFILE,
      }}
      exportConfig={{
        title: "Sales Report",
        filenamePrefix: "cashier-sales-report",
        cashierName: CASHIER_PROFILE.name,
      }}
    />
  );
};

export default KasirSalesReportPage;
