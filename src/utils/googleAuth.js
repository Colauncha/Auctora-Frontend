import { current } from './links';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GA_STORAGE_KEY = 'google_oauth';
export const GOOGLE_CALLBACK_PATH = '/auth/google/callback';

const getRedirectUri = () => `${window.location.origin}${GOOGLE_CALLBACK_PATH}`;

const randomState = () =>
  window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (b) =>
        b.toString(16).padStart(2, '0')
      ).join('');

// Full-page redirect to Google's consent screen. A `state` value is stored in
// sessionStorage and verified on return to block login-CSRF; `from` is where
// the user should land after a successful login.
export const startGoogleAuth = ({ from } = {}) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'Google sign-in is not configured (VITE_GOOGLE_CLIENT_ID).'
    );
  }

  const state = randomState();
  sessionStorage.setItem(
    GA_STORAGE_KEY,
    JSON.stringify({ state, from: from || null })
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });

  window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

// Returns the stored { state, from } and clears it — each state is single-use.
export const consumeGoogleAuthState = () => {
  const raw = sessionStorage.getItem(GA_STORAGE_KEY);
  sessionStorage.removeItem(GA_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Exchanges Google's one-time authorization code for app tokens.
export const exchangeGoogleCode = async (code) => {
  const res = await fetch(
    `${current}users/auth/callback?code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(getRedirectUri())}`,
    { method: 'GET', credentials: 'include' }
  );

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const err = new Error(body?.message || 'Google sign-in failed');
    err.detail = body?.detail;
    throw err;
  }

  return body;
};
