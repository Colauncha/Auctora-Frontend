// import { ps_5, user } from "../Constants";

// const Carousel = () => {
//   return (
//     <div className="p-[80px]">
//       <img src={ps_5} fetchPriority="high" alt="PS5" />
//     </div>
//   );
// };

// export default Carousel;

import { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ps_5, Nikon, Fride, AC, Macbook } from '../Constants';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

const carouselImages = [ps_5, Nikon, Fride, AC, Macbook];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    draggable: true,
    fade: true,
    beforeChange: (_, next) => setActiveIndex(next),

    // Custom arrows
    nextArrow: (
      <ArrowRightCircle
        color="#9f3248"
        className="slick-arrow slick-next"
        size={30}
      />
    ),
    prevArrow: (
      <ArrowLeftCircle
        color="#9f3248"
        className="slick-arrow slick-prev"
        size={30}
      />
    ),

    // Custom dots with active color
    customPaging: (i) => (
      <div
        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
          i === activeIndex
            ? 'bg-[#9f3248aa]'
            : 'bg-gray-300 hover:bg-[#9f3248]'
        }`}
        style={{ display: 'inline-block', margin: '0 5px' }}
      ></div>
    ),

    dotsClass: 'slick-dots custom-dots',
  };

  return (
    <div className="block w-full p-4 lg:p-20">
      <Slider {...carouselSettings}>
        {carouselImages.map((src, i) => (
          <div
            key={i}
            className="flex justify-center items-center bg-transparent"
          >
            <img
              src={src}
              alt={`carousel image ${i + 1}`}
              className="w-full h-auto max-w-[600px] object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
