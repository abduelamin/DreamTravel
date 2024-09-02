/* eslint-disable no-unused-vars */
import React from "react";
import { categories } from "../data";
import { NavLink } from "react-router-dom";


const Categories = () => {
    return (
      <div className="py-12 px-16 sm:px-5 flex flex-col items-center text-center bg-lightgrey">
        <h1 className="text-blue text-4xl font-extrabold mb-4">
          Explore Top Categories
        </h1>
        
        <p className="max-w-3xl text-xl">
          View a wide range of vacation rentals that cater to all types of travellers! 
          Open the doors to your holiday home!
        </p>
  
        <div className="flex flex-wrap py-12 justify-center gap-5">
          {categories?.slice(1, 7).map((category, index) => (
            <NavLink key={index} to="">
              <div className="relative flex justify-center items-center w-[250px] h-[200px] cursor-pointer">
                <img
                  src={category.img}
                  alt={category.label}
                  className="absolute w-full h-full object-cover"
                />
                

                <div className="absolute w-full h-full bg-black/55 transition-all ease-in-out duration-300 hover:w-[80%] hover:h-[80%]"></div>
                

                <div className="relative text-white flex flex-col items-center">
                  <div className="text-[45px]">{category.icon}</div>
                  <p className="font-semibold">{category.label}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    );
  };
  
  export default Categories;
