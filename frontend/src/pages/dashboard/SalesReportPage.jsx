import { useShallow } from "zustand/react/shallow";
import SalesReportView from "../../features/sales-report/components/SalesReportView";
import { toReportOrders } from "../../lib/transactionAdapters";
import { useTransactionsStore } from "../../stores/transactionsStore";
import DocumentTitle from "../../components/DocumentTitle";

const SalesReportPage = () => {
  const { transactions, transactionsMeta, isLoading, error, fetchTransactions } = useTransactionsStore(
    useShallow((state) => ({
      transactions: state.transactions,
      transactionsMeta: state.transactionsMeta,
      isLoading: state.isLoading,
      error: state.error,
      fetchTransactions: state.fetchTransactions,
    })),
  );

  return (
    <>
      <DocumentTitle title="Laporan Penjualan" />
      <SalesReportView
        orders={toReportOrders(transactions)}
        paginationMeta={transactionsMeta}
        isLoading={isLoading}
        errorMessage={error}
        pageTitle="Laporan Penjualan"
        layoutSidebarProps={{ activeItem: "orders" }}
        onRequestTransactions={fetchTransactions}
        exportConfig={{
          title: "Sales Report",
          filenamePrefix: "sales-report",
        }}
      />
    </>
  );
};

export default SalesReportPage;
