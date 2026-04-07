import { create } from "zustand";
import { requestApi } from "../lib/apiClient";
import { useAuthStore } from "./authStore";

const requireToken = () => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error("Authentication required.");
  }

  return token;
};

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
      const transactions = await requestApi("/transactions", {
        token: requireToken(),
      });

      set({ transactions, isLoading: false, error: "" });
      return transactions;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  fetchTransactionDetail: async (transactionUuid) => {
    set({ isLoading: true, error: "" });

    try {
      const transaction = await requestApi(`/transactions/${transactionUuid}`, {
        token: requireToken(),
      });

      set({ selectedTransaction: transaction, isLoading: false, error: "" });
      return transaction;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createTransaction: async (payload) => {
    set({ isSubmitting: true, error: "" });

    try {
      const transaction = await requestApi("/transactions", {
        method: "POST",
        token: requireToken(),
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
      set({ isSubmitting: false, error: error.message });
      throw error;
    }
  },
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));
