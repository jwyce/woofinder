import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  name: string;
  email: string;
  avatar?: string;
};

type WoofinderStore = {
  user?: User;
  favorites: string[];
  addFavorite: (favorite: string) => void;
  removeFavorite: (favorite: string) => void;
  clearFavorites: () => void;
  setUser: (user: User | undefined) => void;
};

export const useWoofinderStore = create(
  persist<WoofinderStore>(
    (set, get) => ({
      user: undefined,
      favorites: [],
      addFavorite: (favorite) => set({ favorites: [...get().favorites, favorite] }),
      removeFavorite: (favorite) =>
        set({ favorites: get().favorites.filter((f) => f !== favorite) }),
      clearFavorites: () => set({ favorites: [] }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'woofinder-storage',
    },
  ),
);
