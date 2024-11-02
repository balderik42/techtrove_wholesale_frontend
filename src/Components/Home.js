import React from 'react';
import Banner from './Banner/Banner';
import CatageryList from './CatogeryList/CatageryList';
import NewArrivals from './NewArrivals/NewArrivals';
import FeaturedProducts from './FeaturedProduct/FeaturedProduct';


const Home = () => {
  return (
    <div>
     <Banner/>
     <CatageryList/>
     <NewArrivals/>
     <FeaturedProducts/>
    </div>
  );
};

export default Home;