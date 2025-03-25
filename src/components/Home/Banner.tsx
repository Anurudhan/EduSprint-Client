import React, { useEffect, useState, useRef } from 'react';
import Slider from "react-slick";
import { motion } from "framer-motion";
import { BannerEntity } from '../../types/IBanner';
import { commonRequest, URL } from '../../common/api';
import { config } from '../../common/config';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Banner.css'; 

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerEntity[]>([]);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await commonRequest<BannerEntity[]>("GET", `${URL}/user/active-banners`, undefined, config);
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    dotsClass: "slick-dots custom-dots",
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white bg-opacity-40 hover:bg-opacity-80 transition-all duration-300" />
    ),
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="w-full h-[600px] overflow-hidden relative group">
      <Slider ref={sliderRef} {...settings}>
        {banners.map((banner) => (
          <motion.div
            key={banner._id}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-full h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-gray-900/30 z-10" />
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center px-6">
                <motion.h2
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="text-white text-5xl md:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg"
                >
                  {banner.title}
                </motion.h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                  className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mt-6 mx-auto"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </Slider>

      <motion.button
        variants={buttonVariants}
        initial="hidden"
        whileHover="visible"
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900/80 to-gray-700/80 p-4 rounded-full shadow-xl transition-all duration-300 z-30 group-hover:opacity-100 opacity-0"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <ChevronLeft className="text-white w-7 h-7" />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        initial="hidden"
        whileHover="visible"
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900/80 to-gray-700/80 p-4 rounded-full shadow-xl transition-all duration-300 z-30 group-hover:opacity-100 opacity-0"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <ChevronRight className="text-white w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default Banner;