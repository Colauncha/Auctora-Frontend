import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { google_auth } from '../../Constants';
import { startGoogleAuth } from '../../utils/googleAuth';
import { toastError } from '../../utils/toast';

const GoogleAuthButton = ({ label }) => {
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  const handleClick = () => {
    if (redirecting) return;
    setRedirecting(true);
    try {
      const from = location.state?.from;
      const fromPath = from
        ? `${from.pathname || ''}${from.search || ''}${from.hash || ''}`
        : null;
      startGoogleAuth({ from: fromPath });
    } catch (err) {
      toastError(err.message || 'Could not start Google sign-in');
      setRedirecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-2 items-center">
      <p>{label}</p>
      <button
        type="button"
        onClick={handleClick}
        disabled={redirecting}
        aria-label="Continue with Google"
        className="bg-[#f5f5f5] p-3 rounded-full cursor-pointer hover:bg-[#de506d] hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:cursor-wait"
      >
        <img src={google_auth} alt="" className="w-10 h-10" />
      </button>
    </div>
  );
};

GoogleAuthButton.propTypes = {
  label: PropTypes.string.isRequired,
};

export default GoogleAuthButton;
