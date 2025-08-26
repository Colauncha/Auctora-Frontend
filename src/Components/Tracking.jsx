import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setCookie, getCookie } from '../utils/Cookies';

const Tracking = ({ children }) => {
  const IncrVisitorsCount = async ({ type = 'unique' }) => {
    let url;
    const uniqueUrl = `https://news-letter-middle-app.vercel.app/api/tracking/visitors/`;
    const nonUniqueUrl = `https://news-letter-middle-app.vercel.app/api/tracking/nu/visitors/`;
    if (type === 'unique') {
      url = uniqueUrl;
    } else if (type === 'non-unique') {
      url = nonUniqueUrl;
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-clientname': 'BIDDIUS',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to push visitors count');
      }
    } catch (err) {
      console.error('Error pushing count:', err);
    }
  };

  useEffect(() => {
    const dailyVisit = getCookie('dailyVisit');
    const nonUniqueVisit = sessionStorage.getItem('nonUniqueVisit');
    if (!nonUniqueVisit) {
      sessionStorage.setItem('nonUniqueVisit', 'true');
      IncrVisitorsCount({ type: 'non-unique' });
    }
    if (!dailyVisit) {
      IncrVisitorsCount({ type: 'unique' });
      setCookie('dailyVisit', 'true', 1, { sameSite: 'Lax' });
    }
  }, []);

  return <>{children}</>;
};

Tracking.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Tracking;
