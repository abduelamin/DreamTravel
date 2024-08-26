/* eslint-disable no-unused-vars */

import React, { useContext } from "react";
import { UserContext } from "../utils/Context.jsx"; 

const Homepage = () => {
  const { user } = useContext(UserContext); 

  return (
    <div>
      {user ? <h1>Welcome, {user.firstname}!</h1> : <h1>Please log in.</h1>}
    </div>
  );
};

export default Homepage;