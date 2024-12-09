// pages/Home.tsx
import React from 'react';
import Banner from '../../components/Home/Banner';
import  { CourseCategories } from '../../components/Home/Categories';
import NewCourses from '../../components/Home/NewCourses';
import { Instructors } from '../../components/Home/Instructors';
import { PopularCourses } from '../../components/Home/PoppularCourses';



const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <CourseCategories />
      <PopularCourses/>
      <Instructors />
      <NewCourses />
    </div>
  );
};

export default Home;
