/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { context } from "../utils/Context.jsx"; 
import Slide from "../components/Slide.jsx";
import Categories from './../components/Categories';
import Listings from './../components/Listings';

const Homepage = () => {
  const { user } = useContext(context); 

  return (
    <div>
      {user && <h1>Welcome, {user.firstname}!</h1>}
    <Slide />
    <Categories/>
    <Listings/>
    
    </div>
  );
};

export default Homepage;