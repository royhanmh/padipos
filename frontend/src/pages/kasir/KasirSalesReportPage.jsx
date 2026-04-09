import { useEffect } from "react";
import { PiBasketLight, PiGearSixLight, PiReceiptLight } from "react-icons/pi";
import { useShallow } from "zustand/react/shallow";
import CashierOrderArchiveControl from "../../features/cashier-order-archive/components/CashierOrderArchiveControl";
import SalesReportView from "../../features/sales-report/components/SalesReportView";
import { toReportOrders } from "../../lib/transactionAdapters";
import { useAuthStore } from "../../stores/authStore";
import { useTransactionsStore } from "../../stores/transactionsStore";
import DocumentTitle from "../../components/DocumentTitle";

const KasirSalesReportPage = () => {
  const user = useAuthStore((state) => state.user);
  const { transactions, isLoading, error, fetchTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      isLoading: state.isLoading,
      error: state.error,
      fetchTransactions: state.fetchTransactions,
    })),
  );

  useEffect(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  return (
    <>
      <DocumentTitle title="Laporan Harian Kasir" />
      <SalesReportView
      orders={toReportOrders(transactions)}
      isLoading={isLoading}
      errorMessage={error}
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
          {
            id: "settings",
            icon: PiGearSixLight,
            label: "Settings",
            href: "/kasir/settings",
          },
        ],
      }}
      layoutTopbarProps={{
        beforeProfile: <CashierOrderArchiveControl />,
      }}
      exportConfig={{
        title: "Sales Report",
        filenamePrefix: "cashier-sales-report",
        cashierName: user?.username,
      }}
      showStats
    />
    </>
  );
};

export default KasirSalesReportPage;
