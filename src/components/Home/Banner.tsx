// components/Banner.tsx
import React from 'react';
import Slider from "react-slick";

const Banner: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="w-full h-[400px]">
      <Slider {...settings}>
        <div>
          <img src="https://via.placeholder.com/1200x400" alt="Banner 1" className="w-full h-full object-cover" />
        </div>
        <div>
          <img src="https://via.placeholder.com/1200x400" alt="Banner 2" className="w-full h-full object-cover" />
        </div>
        <div>
          <img src="https://via.placeholder.com/1200x400" alt="Banner 3" className="w-full h-full object-cover" />
        </div>
      </Slider>
    </div>
  );
};

export default Banner;
