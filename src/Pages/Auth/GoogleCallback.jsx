import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../Store/AuthStore';
import { consumeGoogleAuthState, exchangeGoogleCode } from '../../utils/googleAuth';
import { toastError, toastSuccess } from '../../utils/toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  // Google auth codes are single-use; guard against StrictMode / re-renders
  // firing the exchange twice (the second would fail with invalid_grant).
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const stored = consumeGoogleAuthState();

    // Don't leave the one-time code sitting in the URL / history.
    window.history.replaceState(null, '', window.location.pathname);

    const fail = (message, detail) => {
      toastError(message, detail);
      navigate('/sign-in', { replace: true });
    };

    if (error) {
      fail(
        error === 'access_denied'
          ? 'Google sign-in was cancelled'
          : 'Google sign-in failed',
      );
      return;
    }

    if (!code || !state || !stored || stored.state !== state) {
      fail('Google sign-in failed', 'Invalid or expired sign-in request. Please try again.');
      return;
    }

    const run = async () => {
      try {
        const body = await exchangeGoogleCode(code);
        const { access_token, refresh_token } = body?.data?.token || {};
        if (!access_token || !refresh_token) {
          throw new Error('Google sign-in did not return a session');
        }

        login(true, access_token, refresh_token, body.data.user);
        toastSuccess(body.message || 'Log In Successful');
        navigate(stored.from || '/dashboard', { replace: true });
      } catch (err) {
        fail(err.message || 'Google sign-in failed', err.detail);
      }
    };
    run();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-[#9f3248] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#848a8f]">Signing you in with Google…</p>
    </div>
  );
};

export default GoogleCallback;
