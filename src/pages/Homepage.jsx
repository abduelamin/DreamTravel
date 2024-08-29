/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { context } from "../utils/Context.jsx"; 

const Homepage = () => {
  const { user } = useContext(context); 

  return (
    <div>
      {user ? <h1>Welcome, {user.firstname}!</h1> : <h1>Please log in.</h1>}
    </div>
  );
};

export default Homepage;