import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import SalesReportView from "../../features/sales-report/components/SalesReportView";
import { toReportOrders } from "../../lib/transactionAdapters";
import { useTransactionsStore } from "../../stores/transactionsStore";

const SalesReportPage = () => {
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
    <SalesReportView
      orders={toReportOrders(transactions)}
      isLoading={isLoading}
      errorMessage={error}
      pageTitle="Sales Report"
      layoutSidebarProps={{ activeItem: "orders" }}
      exportConfig={{
        title: "Sales Report",
        filenamePrefix: "sales-report",
      }}
      showStats
    />
  );
};

export default SalesReportPage;
