import { create } from "zustand";

type NavigationStore = {
  navWidth: number;
  notiWidth: number;
  setNavWidth: (width: number) => void;
  setNotiWidth: (width: number) => void;
};

export const useNavigation = create<NavigationStore>((set, get) => ({
  navWidth: 300,
  notiWidth: 300,
  setNavWidth: (width: number) => set({ navWidth: width }),
  setNotiWidth: (width: number) => set({ notiWidth: width }),
}));
