/* eslint-disable no-unused-vars */
import React from 'react';
import slide from '../assets/slide.jpg';

const Slide = () => {
  return (
    <div
      className="relative w-screen h-[80vh] flex items-center justify-center"
    >
      <div
        style={{
          backgroundImage: `url(${slide})`,
        }}
        className="absolute inset-0 w-full h-full bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Text Content */}
      <h1 className="relative z-10 p-10 text-4xl text-white text-center">
        Welcome Home! Make Your Memories
      </h1>
    </div>
  );
};

export default Slide;
