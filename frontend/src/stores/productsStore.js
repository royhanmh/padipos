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

export const useProductsStore = create((set, get) => ({
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
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createProduct: async (payload) => {
    try {
      const createdProduct = await requestApi("/products", {
        method: "POST",
        token: requireToken(),
        body: payload,
      });

      set((state) => ({
        products: [createdProduct, ...state.products],
        error: "",
      }));

      return createdProduct;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  updateProduct: async (productUuid, payload) => {
    try {
      const updatedProduct = await requestApi(`/products/${productUuid}`, {
        method: "PATCH",
        token: requireToken(),
        body: payload,
      });

      set((state) => ({
        products: state.products.map((product) =>
          product.uuid === productUuid ? updatedProduct : product,
        ),
        error: "",
      }));

      return updatedProduct;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  deleteProduct: async (productUuid) => {
    try {
      await requestApi(`/products/${productUuid}`, {
        method: "DELETE",
        token: requireToken(),
      });

      set((state) => ({
        products: state.products.filter((product) => product.uuid !== productUuid),
        error: "",
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
