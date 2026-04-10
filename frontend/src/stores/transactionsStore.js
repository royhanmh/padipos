import { create } from "zustand";
import { requestApi } from "../lib/apiClient";
import { handleProtectedAuthError } from "./authStore";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  isSubmitting: false,
  error: "",
  clearError: () => set({ error: "" }),
  fetchTransactions: async () => {
    set({ isLoading: true, error: "" });

    try {
      const transactions = await requestApi("/transactions");

      set({ transactions, isLoading: false, error: "" });
      return transactions;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
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
