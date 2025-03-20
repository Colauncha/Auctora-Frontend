import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ title, icon, className, to }) => {
  return (
    <Link
      className={`w-[120px] h-[150px] lg:flex place-content-center place-items-center lg:border-[1px] lg:w-[254px] lg:h-[200px] lg:bg-[#faf3f4c3] rounded-[8px] ${className}`}
      to={to}
    >
      <div className="flex flex-col items-center">
        {/* Icon Container */}
        {/* <div className="icon-container w-[80px] h-[80px] border-[1px] flex place-items-center place-content-center rounded-full mb-[20px] lg:bg-gradient-to-r from-[#7B2334] to-[#9F3247]">
          <img
            src={icon}
            alt=""
            className="w-12 h-12 lg:filter lg:brightness-0 lg:invert" // Ensure icons are visible on all screens
          />
        </div> */}
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

export default CategoryCard;


// const CategoryCard = ({ icon, title, className, to }) => {
//   return (
//     <NavLink to={to} className={className}>
//       <div className="flex flex-col items-center">
//         {/* Icon with Background */}
//         <div className="icon-container bg-white p-2 rounded-lg">
//           <img src={icon} alt={title} className="w-12 h-12" />
//         </div>
//         {/* Title */}
//         <p className="mt-2 text-center">{title}</p>
//       </div>
//     </NavLink>
//   );
// };

// export default CategoryCard;