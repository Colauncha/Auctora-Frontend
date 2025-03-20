import { ps_5, user } from "../Constants";

const Carousel = () => {
  return (
    <div className="p-[80px]">
      <img src={ps_5} alt="" />
    </div>
  );
};

export default Carousel;

// import { ps_5,  Nikon,  user } from "../Constants";

// const Carousel = () => {
//   return (
//     <div className="p-4 lg:p-[80px] flex justify-center">
//       <img
//         src={ps_5}
//         alt=""
//         className="w-full max-w-[400px] lg:max-w-[600px]"
//       />
//     </div>
//   );
// };

// export default Carousel;

// import React from "react";
// import Slider from "react-slick"; // Import react-slick
// import "slick-carousel/slick/slick.css"; // Import slick-carousel's CSS
// import "slick-carousel/slick/slick-theme.css";
// import { ps_5, Nikon, Fride, AC, Macbook, user } from "../Constants";

// const Carousel = () => {
//   const images = [ps_5, Nikon, Fride, AC, Macbook, user]; // Array of images

//   const settings = {
//     dots: true, // Display dots for navigation
//     infinite: true, // Infinite looping
//     speed: 500, // Transition speed
//     slidesToShow: 1, // Show one slide at a time
//     slidesToScroll: 1, // Scroll one slide at a time
//     autoplay: true, // Auto-play slides
//     autoplaySpeed: 3000, // 3 seconds interval
//     arrows: true, // Next/Previous arrows
//   };

//   return (
//     <div className="p-4 lg:p-[80px]">
//       <Slider {...settings}>
//         {images.map((image, index) => (
//           <div key={index} className="flex justify-center">
//             <img
//               src={image}
//               alt={`carousel-img-${index}`}
//               className="w-full max-w-[400px] lg:max-w-[600px]"
//             />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Carousel;


// import React from "react";
// import Slider from "react-slick"; // Import react-slick
// import "slick-carousel/slick/slick.css"; // Import slick-carousel's CSS
// import "slick-carousel/slick/slick-theme.css";
// import { ps_5, Nikon, Fride, AC, Macbook, user } from "../Constants";

// const Carousel = () => {
//   const images = [ps_5, Nikon, Fride, AC, Macbook, user]; // Array of images

//   // Settings for the carousel
//   const settings = {
//     dots: true, // Display dots for navigation
//     infinite: true, // Infinite looping
//     speed: 500, // Transition speed
//     slidesToShow: 1, // Show one slide at a time
//     slidesToScroll: 1, // Scroll one slide at a time
//     autoplay: true, // Auto-play slides
//     autoplaySpeed: 3000, // 3 seconds interval
//     arrows: true, // Next/Previous arrows
//     responsive: [
//       {
//         breakpoint: 1024, // Adjust settings for screens smaller than 1024px
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: true,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 768, // Adjust settings for screens smaller than 768px
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           initialSlide: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="p-4 lg:p-[80px]">
//       <Slider {...settings}>
//         {images.map((image, index) => (
//           <div key={index} className="flex justify-center">
//             <img
//               src={image}
//               alt={`carousel-img-${index}`}
//               className="w-full max-w-[400px] lg:max-w-[600px]"
//             />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Carousel;