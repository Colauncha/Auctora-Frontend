// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, BanknoteArrowUp } from 'lucide-react';
import PropTypes from 'prop-types';

const options = [
  {
    name: 'View Auction',
    icon: ShoppingCart,
    to: '/product-details/:id',
  },
  {
    name: 'Finalize Auction',
    icon: BanknoteArrowUp,
    to: '/product/finalize/:id',
  },
];

const ChatOptions = ({ id }) => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log('ChatOptions rendered with id:', id);
  // }, [id]);

  return (
    <div className="absolute top-12 -right-10 w-max bg-black/40 backdrop-blur-md flex flex-col gap-1 text-white shadow-lg rounded-xl p-2">
      {options.map((option, idx) => (
        <>
          <div
            key={idx}
            className="flex items-center justify-between gap-5 p-2 w-full rounded-md hover:bg-white/20 cursor-pointer"
            onClick={() => {
              navigate(option.to.replace(':id', encodeURIComponent(id)));
            }}
          >
            <option.icon size={20} />
            <span className="text-sm">{option.name}</span>
          </div>
          {idx !== options.length - 1 && (
            <hr className="border-t border-white/20" />
          )}
        </>
      ))}
    </div>
  );
};

ChatOptions.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ChatOptions;
