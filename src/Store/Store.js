// useModeStore.js
import { create } from "zustand";
const useModeStore = create((set) => ({
  isMobile: false,
  isPWA: false,
  toggleMode: () =>
    set((state) => ({
      isMobile: !state.isMobile,
    })),
  setModeBasedOnScreenSize: () =>
    set(() => ({
      isMobile: typeof window !== "undefined" && window.innerWidth <= 768,
      isPWA:
        typeof window !== "undefined" &&
        (window.matchMedia("(display-mode: standalone)").matches ||
          window.navigator.standalone === true),
    })),
}));

export default useModeStore;
