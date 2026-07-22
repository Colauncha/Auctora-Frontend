import { create } from 'zustand';

// access_token / refresh_token / loggedIn live in localStorage (not
// sessionStorage) so a valid session survives opening a new tab or
// restarting the browser, and so refresh-token rotation in one tab is
// visible to others via the 'storage' event below. `_user` stays in
// sessionStorage — it's just a display cache, refetched from the API
// when absent, so it doesn't need to affect auth state.
const readStoredAuth = () => ({
  loggedIn: localStorage.getItem('loggedIn') === 'true',
  accessToken: localStorage.getItem('access_token') || '',
  refreshToken: localStorage.getItem('refresh_token') || '',
  websocketToken: localStorage.getItem('websocket_token') || '',
});

const useAuthStore = create((set) => {
  const stored = readStoredAuth();
  const dataFromStorage = sessionStorage.getItem('_user')
    ? JSON.parse(sessionStorage.getItem('_user'))
    : {};

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (
        event.key !== 'loggedIn' &&
        event.key !== 'access_token' &&
        event.key !== 'refresh_token' &&
        event.key !== 'websocket_token'
      ) {
        return;
      }
      const next = readStoredAuth();
      set({
        isAuthenticated: next.loggedIn && !!next.accessToken,
        token: next.accessToken,
        refreshToken: next.refreshToken,
        websocketToken: next.websocketToken,
      });
    });
  }

  return {
    isAuthenticated: stored.loggedIn && !!stored.accessToken,
    token: stored.accessToken,
    refreshToken: stored.refreshToken,
    websocketToken: stored.websocketToken,
    data: dataFromStorage,

    login: (bool, accessToken, refreshToken, data) => {
      set(() => {
        if (bool) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('access_token', accessToken || '');
          localStorage.setItem('websocket_token', accessToken || '');
          localStorage.setItem('refresh_token', refreshToken || '');
          sessionStorage.setItem('_user', JSON.stringify(data || {}));
          return {
            isAuthenticated: true,
            token: accessToken || '',
            refreshToken: refreshToken || '',
            websocketToken: accessToken || '',
            data: data || {},
          };
        }
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('access_token');
        localStorage.removeItem('websocket_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('_user');
        return {
          isAuthenticated: false,
          token: '',
          refreshToken: '',
          webscoketToken: '',
          data: {},
        };
      });
    },

    updateTokens: (accessToken, refreshToken) => {
      localStorage.setItem('access_token', accessToken || '');
      localStorage.setItem('websocket_token', accessToken || '');
      localStorage.setItem('refresh_token', refreshToken || '');
      if (accessToken) {
        localStorage.setItem('loggedIn', 'true');
      }
      set({
        token: accessToken || '',
        refreshToken: refreshToken || '',
        websoketToken: accessToken || '',
        isAuthenticated: !!accessToken,
      });
    },

    updateData: (partialData) => {
      set((state) => {
        const updated = { ...state.data, ...partialData };
        sessionStorage.setItem('_user', JSON.stringify(updated));
        return { data: updated };
      });
    },

    logout: () => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('access_token');
      localStorage.removeItem('websocket_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('_user');
      set({ isAuthenticated: false, token: '', refreshToken: '', data: {} });
    },
  };
});

export default useAuthStore;
