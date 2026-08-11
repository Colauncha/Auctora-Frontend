import PropTypes from 'prop-types';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
  <>
    {Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`${
            i < Math.floor(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          } w-5 h-5`}
        />
      ))}
  </>
);

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
