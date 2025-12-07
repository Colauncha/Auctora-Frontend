import { create } from 'zustand';

const useAuthStore = create((set) => {
  const storedExpires = localStorage.getItem('auth_expires_at');
  const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const tokenFromStorage = sessionStorage.getItem('token') || '';
  const dataFromStorage = sessionStorage.getItem('_user')
    ? JSON.parse(sessionStorage.getItem('_user'))
    : {};

  let isAuthenticated = false;
  let timeout = null;

  if (storedLoggedIn && storedExpires) {
    const expiresAt = parseInt(storedExpires, 10);
    const remaining = expiresAt - Date.now();
    if (remaining > 0) {
      isAuthenticated = true;
      timeout = setTimeout(() => {
        set({ isAuthenticated: false, token: '', data: {}, timeout: null });
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('auth_expires_at');
        sessionStorage.removeItem('_user');
        sessionStorage.removeItem('token');
      }, remaining);
    } else {
      // expired already, clean up
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('auth_expires_at');
      sessionStorage.removeItem('_user');
      sessionStorage.removeItem('token');
    }
  }

  return {
    isAuthenticated,
    token: tokenFromStorage,
    data: dataFromStorage,
    timeout,
    // durationMs optional (default 1 hour)
    login: (bool, token, data, durationMs = 3600000) => {
      set((state) => {
        if (state.timeout) clearTimeout(state.timeout);
        if (bool) {
          const expiresAt = Date.now() + durationMs;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('auth_expires_at', String(expiresAt));
          sessionStorage.setItem('_user', JSON.stringify(data || {}));
          sessionStorage.setItem('token', token || '');
          const timeOut = setTimeout(() => {
            set({ isAuthenticated: false, token: '', data: {}, timeout: null });
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('auth_expires_at');
            sessionStorage.removeItem('_user');
            sessionStorage.removeItem('token');
          }, durationMs);
          return {
            isAuthenticated: true,
            token: token || '',
            data: data || {},
            timeout: timeOut,
          };
        }
        // treat false as logout
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('auth_expires_at');
        sessionStorage.removeItem('_user');
        sessionStorage.removeItem('token');
        return { isAuthenticated: false, token: '', data: {}, timeout: null };
      });
    },
    logout: () => {
      set((state) => {
        if (state.timeout) clearTimeout(state.timeout);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('auth_expires_at');
        sessionStorage.removeItem('_user');
        sessionStorage.removeItem('token');
        return { isAuthenticated: false, token: '', data: {}, timeout: null };
      });
    },
  };
});

export default useAuthStore;
