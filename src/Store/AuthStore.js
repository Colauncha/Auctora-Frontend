import { create } from 'zustand';

const useAuthStore = create((set) => {
  const storedLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const accessToken = sessionStorage.getItem('access_token') || '';
  const refreshToken = sessionStorage.getItem('refresh_token') || '';
  const dataFromStorage = sessionStorage.getItem('_user')
    ? JSON.parse(sessionStorage.getItem('_user'))
    : {};

  return {
    isAuthenticated: storedLoggedIn && !!accessToken,
    token: accessToken,
    refreshToken,
    data: dataFromStorage,

    login: (bool, accessToken, refreshToken, data) => {
      set(() => {
        if (bool) {
          localStorage.setItem('loggedIn', 'true');
          sessionStorage.setItem('access_token', accessToken || '');
          sessionStorage.setItem('refresh_token', refreshToken || '');
          sessionStorage.setItem('_user', JSON.stringify(data || {}));
          return {
            isAuthenticated: true,
            token: accessToken || '',
            refreshToken: refreshToken || '',
            data: data || {},
          };
        }
        localStorage.removeItem('loggedIn');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('_user');
        return { isAuthenticated: false, token: '', refreshToken: '', data: {} };
      });
    },

    updateTokens: (accessToken, refreshToken) => {
      sessionStorage.setItem('access_token', accessToken || '');
      sessionStorage.setItem('refresh_token', refreshToken || '');
      set({ token: accessToken || '', refreshToken: refreshToken || '' });
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
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('_user');
      set({ isAuthenticated: false, token: '', refreshToken: '', data: {} });
    },
  };
});

export default useAuthStore;
