import { create } from "zustand";
import { requestApi } from "../lib/apiClient";
import { handleProtectedAuthError } from "./authStore";

const buildTransactionsQuery = (options = {}) => {
  const query = new URLSearchParams();

  if (options.page !== undefined) {
    query.set("page", String(options.page));
  }

  if (options.limit !== undefined) {
    query.set("limit", String(options.limit));
  }

  if (options.startDate) {
    query.set("start_date", options.startDate);
  }

  if (options.finishDate) {
    query.set("finish_date", options.finishDate);
  }

  if (options.category && options.category !== "all") {
    query.set("category", options.category);
  }

  if (options.orderType && options.orderType !== "all") {
    query.set("order_type", options.orderType);
  }

  const queryString = query.toString();
  return queryString ? `/transactions?${queryString}` : "/transactions";
};

export const useTransactionsStore = create((set) => ({
  transactions: [],
  transactionsMeta: null,
  selectedTransaction: null,
  isLoading: false,
  isSubmitting: false,
  error: "",
  clearError: () => set({ error: "" }),
  fetchTransactions: async (options = {}) => {
    set({ isLoading: true, error: "" });

    try {
      const response = await requestApi(buildTransactionsQuery(options));
      const isPaginatedResponse =
        response &&
        typeof response === "object" &&
        Array.isArray(response.data) &&
        response.meta;
      const transactions = isPaginatedResponse ? response.data : response;

      set({
        transactions,
        transactionsMeta: isPaginatedResponse ? response.meta : null,
        isLoading: false,
        error: "",
      });
      return transactions;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  fetchTransactionsSnapshot: async (options = {}) => {
    try {
      const response = await requestApi(buildTransactionsQuery(options));
      if (response && typeof response === "object" && Array.isArray(response.data)) {
        return response.data;
      }

      return response;
    } catch (error) {
      handleProtectedAuthError(error);
      throw error;
    }
  },
  fetchTransactionDetail: async (transactionUuid) => {
    set({ isLoading: true, error: "" });

    try {
      const transaction = await requestApi(`/transactions/${transactionUuid}`, {
      });

      set({ selectedTransaction: transaction, isLoading: false, error: "" });
      return transaction;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createTransaction: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const transaction = await requestApi("/transactions", {
        method: "POST",
        body: payload,
      });

      set((state) => ({
        transactions: [transaction, ...state.transactions],
        selectedTransaction: transaction,
        isSubmitting: false,
        error: "",
      }));

      return transaction;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isSubmitting: false, error: error.message });
      throw error;
    }
  },
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));
