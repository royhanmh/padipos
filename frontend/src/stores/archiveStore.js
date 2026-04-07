import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useArchiveStore = create(
  persist(
    (set) => ({
      archivedOrders: [],
      addArchive: (order) => set((state) => ({
        archivedOrders: [
          { ...order, archivedAt: new Date().toISOString() },
          ...state.archivedOrders
        ]
      })),
      removeArchive: (orderId) => set((state) => ({
        archivedOrders: state.archivedOrders.filter((o) => o.id !== orderId)
      })),
      clearArchives: () => set({ archivedOrders: [] })
    }),
    {
      name: 'pos-archive-storage',
    }
  )
);
