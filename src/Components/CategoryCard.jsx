// import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CategoryCard = ({ title, icon, className, to, params }) => {
  return (
    <Link
      className={`w-[120px] h-[150px] lg:flex place-content-center place-items-center lg:border-[1px] lg:w-[254px] lg:h-[200px] lg:bg-[#faf3f4c3] rounded-[8px] ${className}`}
      to={{
        pathname: to,
        search: params.query,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="icon-container w-[80px] h-[80px] border-[1px] flex place-items-center place-content-center rounded-full mb-[20px] bg-white lg:bg-gradient-to-r from-[#7B2334] to-[#9F3247]">
          <img
            src={icon}
            alt=""
            className="w-12 h-12 lg:filter lg:brightness-0 lg:invert"
          />
        </div>
        {/* Title */}
        <div className="text-[16px] font-[400] capitalize">{title}</div>
      </div>
    </Link>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
  params: PropTypes.objectOf({
    query: PropTypes.string,
    subCat: PropTypes.string,
    cat: PropTypes.string,
  }),
};

export default CategoryCard;
