import useAuthStore from '../Store/AuthStore';
import { current } from './links';

let isRefreshing = false;
let refreshQueue = [];

const runRefresh = async () => {
  const { refreshToken, updateTokens, logout } = useAuthStore.getState();

  if (!refreshToken) {
    logout();
    return null;
  }

  try {
    const res = await fetch(`${current}users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      const { access_token, refresh_token } = data.data.token;
      updateTokens(access_token, refresh_token);
      return access_token;
    }
  } catch {
    // fall through to logout
  }

  logout();
  return null;
};

// Ensures at most one refresh request is ever in flight — concurrent callers
// (parallel 401s, or a route guard checking session validity) share the same
// in-flight refresh instead of each racing the rotating refresh token.
export const ensureFreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }
  isRefreshing = true;
  const newToken = await runRefresh();
  isRefreshing = false;
  refreshQueue.forEach((resolve) => resolve(newToken));
  refreshQueue = [];
  return newToken;
};

const buildHeaders = (token, contentType) => {
  const headers = {};
  if (contentType && contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const buildBody = (requestData, contentType) => {
  if (!requestData) return null;
  if (contentType === 'multipart/form-data') {
    const formData = new FormData();
    Object.keys(requestData).forEach((key) => {
      formData.append(key, requestData[key]);
    });
    return formData;
  }
  return JSON.stringify(requestData);
};

// Drop-in replacement for native fetch — intercepts 401, refreshes, retries.
export const authFetch = async (url, options = {}) => {
  let res = await fetch(url, { credentials: 'include', ...options });

  if (res.status === 401) {
    const newToken = await ensureFreshToken();

    if (newToken) {
      const headers = { ...(options.headers || {}) };
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { credentials: 'include', ...options, headers });
    }
  }

  return res;
};

const Fetch = async ({
  url,
  requestData,
  token,
  method = 'GET',
  contentType = 'application/json',
}) => {
  let data = null;
  let error = null;

  if (!url) {
    return { data, error: new Error('URL is required'), success: false };
  }

  let res = await fetch(url, {
    method,
    headers: buildHeaders(token, contentType),
    body: buildBody(requestData, contentType),
    credentials: 'include',
  });

  if (res.status === 401) {
    const newToken = await ensureFreshToken();

    if (newToken) {
      res = await fetch(url, {
        method,
        headers: buildHeaders(newToken, contentType),
        body: buildBody(requestData, contentType),
        credentials: 'include',
      });
    }
  }

  if (!res.ok) {
    error = new Error(`HTTP error! status: ${res.status}`);
  }

  data = await res.json().catch((err) => {
    console.error('Fetch error:', err);
    error = err;
  });

  return { data, error, success: res.ok };
};

export default Fetch;
