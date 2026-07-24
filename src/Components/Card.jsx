import { Link } from "react-router-dom";
import { PropTypes } from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { FiClock } from 'react-icons/fi';
import { capitalize } from '../utils';

const Card = ({
  imgUrl,
  itemName,
  price,
  bid,
  countDown,
  to,
  status,
  startDate,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(countDown);
  const [timeDesc, setTimeDesc] = useState({
    value: '',
    style: '',
  });

  const calculateTimeLeft = useCallback(
    (endTime) => {
      const now = new Date().getTime();
      const distance = new Date(endTime) - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0 || status === 'completed') {
        return 'Auction Ended';
      }

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    [status],
  );

  // timeDesc effect
  useEffect(() => {
    const now = new Date().getTime();

    const displacement = new Date(countDown) - new Date(startDate);
    const distance2Start = now - new Date(startDate);
    const distance2End = new Date(countDown) - now;

    if (status === 'active') {
      if ((distance2Start / displacement) * 100 < 10) {
        // change to 10
        setTimeDesc({
          value: 'New',
          style: 'border border-green-200 bg-green-50 text-green-600',
        });
      } else if ((distance2End / displacement) * 100 < 10) {
        //change 50 to 90
        setTimeDesc({
          value: 'Ending Soon!!',
          style: 'border border-red-200 bg-red-50 text-red-600',
        });
      }
    }
  }, [countDown, startDate, status]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countDown));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown, calculateTimeLeft]);

  const statusColorScheme = {
    active: 'border border-blue-200 bg-blue-50 text-blue-600',
    completed: 'border border-green-200 bg-green-50 text-green-600',
    cancled: 'border border-red-200 bg-red-50 text-red-600',
    pending: 'border border-yellow-200 bg-yellow-50 text-yellow-600',
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 w-full transition-transform hover:scale-[1.02] ${className}`}
    >
      <img
        src={imgUrl}
        alt={itemName}
        className="w-full h-[160px] sm:h-[190px] md:h-[220px] rounded-xl bg-slate-300 object-cover shadow-md"
      />

      <div className="w-full px-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColorScheme[status]}`}
          >
            {capitalize(status)}
          </span>
          {timeDesc.value && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${timeDesc.style}`}
            >
              {capitalize(timeDesc.value)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
            <FiClock size={10} />
            {timeLeft}
          </span>
        </div>

        <h3 className="text-[#9F3247] text-sm font-bold truncate">
          {itemName}
        </h3>

        <div className="flex justify-between items-center text-[#9F3247]">
          <p className="text-sm font-semibold">{price}</p>
          <p className="text-xs text-right">
            {bid} bid{+bid === 1 ? '' : 's'}
          </p>
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  bid: PropTypes.number.isRequired,
  countDown: PropTypes.string.isRequired,
  startDate: PropTypes.string,
  to: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['active', 'completed', 'cancled', 'pending']),
  className: PropTypes.string,
};

export default Card;
