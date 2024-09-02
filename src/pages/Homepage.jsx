/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { context } from "../utils/Context.jsx"; 
import Slide from "../components/Slide.jsx";
import Categories from './../components/Categories';

const Homepage = () => {
  const { user } = useContext(context); 

  return (
    <div>
      {user ? <h1>Welcome, {user.firstname}!</h1> : <h1>Please log in.</h1>}
    <Slide />
    <Categories/>
    </div>
  );
};

export default Homepage;