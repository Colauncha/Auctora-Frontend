import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from "../../Store/AuthStore";
import { ensureFreshToken } from '../../utils/Fetch';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const location = useLocation();

  // If there's no access token yet but a refresh token exists, the session
  // may still be valid (e.g. a fresh tab, or an access token that expired
  // between visits) — try a silent refresh before redirecting to /sign-in.
  const [checking, setChecking] = useState(!isAuthenticated && !!refreshToken);

  useEffect(() => {
    if (isAuthenticated || !refreshToken) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    setChecking(true);
    ensureFreshToken().finally(() => {
      if (!cancelled) setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refreshToken]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#9f3248] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
