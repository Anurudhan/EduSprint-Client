// pages/Home.tsx
import React from 'react';
import Banner from '../../components/Home/Banner';
import Categories from '../../components/Home/Categories';
import Instructors from '../../components/Home/Instructors';
import NewCourses from '../../components/Home/NewCourses';



const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <Categories />
      <Instructors />
      <NewCourses />
    </div>
  );
};

export default Home;
