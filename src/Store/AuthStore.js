// AuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('loggedIn'),
  token: '',
  data: sessionStorage.getItem('_user')
    ? JSON.parse(sessionStorage.getItem('_user'))
    : {},
  login: (bool, token, data) => {
    localStorage.setItem('loggedIn', bool);
    sessionStorage.setItem('_user', JSON.stringify(data));
    set({ isAuthenticated: true, token: token, data: data });
  },
  logout: () => {
    localStorage.removeItem('loggedIn');
    set({ isAuthenticated: false, token: '', data: {} });
  },
}));

export default useAuthStore;







