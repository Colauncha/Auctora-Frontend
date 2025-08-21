import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setCookie, getCookie } from '../utils/Cookies';

const Tracking = ({ children }) => {
  const IncrVisitorsCount = async () => {
    try {
      const response = await fetch(
        `https://news-letter-middle-app.vercel.app/api/tracking/visitors/`,
        {
          method: 'POST',
          headers: {
            'x-clientname': 'BIDDIUS',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to push visitors count');
      }
    } catch (err) {
      console.error('Error pushing count:', err);
    }
  };

  useEffect(() => {
    const dailyVisit = getCookie('dailyVisit');
    if (!dailyVisit) {
      IncrVisitorsCount();
      setCookie('dailyVisit', 'true', 1, { sameSite: 'Lax' });
    }
  }, []);

  return <>{children}</>;
};

Tracking.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tracking;
