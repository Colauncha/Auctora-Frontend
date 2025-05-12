// AuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('loggedIn'),
  login: (bool) => {
    localStorage.setItem('loggedIn', bool);
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('loggedIn');
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
