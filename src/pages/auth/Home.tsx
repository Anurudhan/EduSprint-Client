// pages/Home.tsx
import React from 'react';
import Banner from '../../components/Home/Banner';
import  { CourseCategories } from '../../components/Home/Categories';
import Footer from '../../components/common/Footer';



const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <CourseCategories />
     <Footer />
    </div>
  );
};

export default Home;
