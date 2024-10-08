import React from 'react';
import { Circles } from 'react-loader-spinner';

const Loader = () => {
  return (
    <>
    <div className="flex justify-center h-screen w-screen">
      <Circles 
        height="80" 
        width="80" 
        color="purple" 
        ariaLabel="loading-indicator"
      />
    </div></>
  );
};

export default Loader;