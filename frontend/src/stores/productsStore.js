import { create } from "zustand";
import { requestApi } from "../lib/apiClient";
import { handleProtectedAuthError } from "./authStore";

export const useProductsStore = create((set) => ({
  products: [],
  isLoading: false,
  error: "",
  clearError: () => set({ error: "" }),
  fetchProducts: async () => {
    set({ isLoading: true, error: "" });

    try {
      const products = await requestApi("/products");
      set({ products, isLoading: false, error: "" });
      return products;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createProduct: async (payload) => {
    set({ isLoading: true, error: "" });

    try {
      const createdProduct = await requestApi("/products", {
        method: "POST",
        body: payload,
      });

      set((state) => ({
        products: [createdProduct, ...state.products],
        isLoading: false,
        error: "",
      }));

      return createdProduct;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateProduct: async (productUuid, payload) => {
    set({ isLoading: true, error: "" });

    try {
      const updatedProduct = await requestApi(`/products/${productUuid}`, {
        method: "PATCH",
        body: payload,
      });

      set((state) => ({
        products: state.products.map((product) =>
          product.uuid === productUuid ? updatedProduct : product,
        ),
        isLoading: false,
        error: "",
      }));

      return updatedProduct;
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  deleteProduct: async (productUuid) => {
    set({ isLoading: true, error: "" });

    try {
      await requestApi(`/products/${productUuid}`, {
        method: "DELETE",
      });

      set((state) => ({
        products: state.products.filter((product) => product.uuid !== productUuid),
        isLoading: false,
        error: "",
      }));
    } catch (error) {
      handleProtectedAuthError(error);
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));
