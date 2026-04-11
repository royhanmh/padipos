import { useEffect, useState } from "react";
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
  const [statsTransactions, setStatsTransactions] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const { transactions, transactionsMeta, isLoading, error, fetchTransactions, fetchTransactionsSnapshot } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      transactionsMeta: state.transactionsMeta,
      isLoading: state.isLoading,
      error: state.error,
      fetchTransactions: state.fetchTransactions,
      fetchTransactionsSnapshot: state.fetchTransactionsSnapshot,
    })),
  );

  useEffect(() => {
    let active = true;

    const loadStatsTransactions = async () => {
      setIsStatsLoading(true);

      try {
        const snapshot = await fetchTransactionsSnapshot();

        if (active) {
          setStatsTransactions(snapshot);
        }
      } catch {
        if (active) {
          setStatsTransactions([]);
        }
      } finally {
        if (active) {
          setIsStatsLoading(false);
        }
      }
    };

    void loadStatsTransactions();

    return () => {
      active = false;
    };
  }, [fetchTransactionsSnapshot]);

  return (
    <>
      <DocumentTitle title="Laporan Harian Kasir" />
      <SalesReportView
        orders={toReportOrders(transactions)}
        statsOrders={toReportOrders(statsTransactions)}
        paginationMeta={transactionsMeta}
        isLoading={isLoading}
        statsLoading={isLoading || isStatsLoading}
        errorMessage={error}
        pageTitle="Sales Report"
        onRequestTransactions={fetchTransactions}
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
