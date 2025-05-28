import { Link } from "react-router-dom";
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';

const Card = ({ imgUrl, itemName, price, sellerName, bid, countDown, to }) => {
  const [timeLeft, setTimeLeft] = useState(countDown);

  const calculateTimeLeft = (endTime) => {
    const now = new Date().getTime();
    const distance = new Date(endTime) - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countDown));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  return (
    // <Link className="flex flex-col relative" to={to}>
    //   <img
    //     src={imgUrl}
    //     alt=""
    //     className="w-[200px] h-[161px] rounded-md bg-slate-300 md:w-[210px] md:h-[249px]"
    //   />
    //   <div className="w-[171px] h-[65px] flex flex-col md:w-[285px]">
    //     <h3 className="text-[#9F3247] text-[12px] font-[700] md:text-[15px]">
    //       {itemName}
    //     </h3>
    //     <div className="flex w-[171px] justify-between md:gap-2 flex-col md:flex-row">
    //       <p className="font-[700] w-[70px] text-[13px] text-[#9F3247] text-left border-1">
    //         {price}
    //       </p>
    //       <p className="text-[12px] text-[#9f3247] flex items-center justify-center text-right">
    //         {bid} bid(s)
    //       </p>
    //     </div>
    //     <div className="flex items-center justify-center cursor-pointer hover:bg-[#9f3248] text-[10px] text-[#fff] bg-[#9f324864] px-1 py-2 font-bold absolute top-[55%] left-3 lg:top-[70%]">
    //       <p>Time Left:</p> <span className="ml-1">{timeLeft}</span>
    //     </div>
    //   </div>
    // </Link>
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
  to: PropTypes.string.isRequired,
};

export default Card;
