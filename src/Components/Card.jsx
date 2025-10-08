import { Link } from "react-router-dom";
import { PropTypes } from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { capitalize } from '../utils';

const Card = ({
  imgUrl,
  itemName,
  price,
  sellerName,
  bid,
  countDown,
  to,
  status,
  startDate,
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
          style: 'bg-green-400 text-white hover:bg-green-500',
        });
      } else if ((distance2End / displacement) * 100 < 10) {
        //change 50 to 90
        setTimeDesc({
          value: 'Ending Soon!!',
          style: 'bg-red-400 text-white hover:bg-red-500',
        });
      }
    }
  }, [countDown, startDate, status]);

  useEffect(() => {
    console.log(sellerName);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countDown));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown, sellerName, calculateTimeLeft]);

  const statusColorScheme = {
    active: 'bg-blue-400 text-white hover:bg-blue-500',
    completed: 'bg-green-400 text-white hover:bg-green-500',
    cancled: 'bg-red-400 text-white hover:bg-red-500',
    pending: 'bg-yellow-300 text-black hover:bg-yellow-500',
  };

  return (
    <Link
      to={to}
      className="relative flex flex-col items-center gap-2 transition-transform hover:scale-[1.02]"
    >
      <img
        src={imgUrl}
        alt={itemName}
        className="w-[200px] h-[161px] md:w-[210px] md:h-[249px] rounded-xl bg-slate-300 object-cover shadow-md"
      />

      <div className="w-full px-2 md:w-[210px]">
        <h3 className="text-[#9F3247] text-sm md:text-base font-bold truncate">
          {itemName}
        </h3>

        <div className="flex justify-between items-center mt-1 text-[#9F3247]">
          <p className="text-sm font-semibold">{price}</p>
          <p className="text-xs text-right">
            {bid} bid{+bid === 1 ? '' : 's'}
          </p>
        </div>

        <div className="absolute top-[55%] left-3 lg:top-[70%] flex items-center justify-center bg-[#9f3248cc] hover:bg-[#9f3247] text-white text-[10px] px-2 py-1 rounded-md shadow cursor-pointer">
          <p className="font-bold">Time Left:</p>
          <span className="ml-1">{timeLeft}</span>
        </div>
        <div
          className={`absolute top-[5%] left-3 lg:top-[5%] flex items-center justify-center opacity-80 hover:opacity-90 ${statusColorScheme[status]} text-[11px] font-semibold px-2 py-1 rounded-md shadow cursor-pointer transition-all duration-300`}
        >
          <span className="ml-1">{capitalize(status)}</span>
        </div>
        {timeDesc.value && (
          <div
            className={`absolute top-[5%] right-3 lg:top-[5%] flex items-center justify-center opacity-80 hover:opacity-90 ${timeDesc.style} text-[8px] animate-ping font-semibold px-2 py-1 rounded-md shadow cursor-pointer transition-all duration-300`}
          >
            <span className="ml-1">{capitalize(timeDesc.value)}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

Card.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  itemName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  sellerName: PropTypes.string.isRequired,
  bid: PropTypes.number.isRequired,
  countDown: PropTypes.string.isRequired,
  startDate: PropTypes.string,
  to: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['active', 'completed', 'cancled', 'pending']),
};

export default Card;
