/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import placeholderLogo from "../assets/logo.png";
import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import { context } from "../utils/Context";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import Cookies from "js-cookie";
const Navbar = () => {
  const { user } = useContext(context);
  const [dropdownMenu, setDropdownMenu] = useState(false);

 console.log(user);


  const handleClick = () => {
    setDropdownMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      Cookies.remove("accessToken");
      window.location = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="flex justify-between items-center p-3 md:px-16 relative">
      <NavLink to="/">
        <img src={placeholderLogo} alt="logo" className="w-24 cursor-pointer" />
      </NavLink>

      {/* <div className="flex items-center border border-gray-300 rounded-full h-12 px-5 gap-10 hover:shadow-md hidden lg:flex">
        <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none"
        />
        <IconButton>
          <Search sx={{ color: "#F8395A" }} />
        </IconButton>
      </div> */}

      <div className="flex items-center gap-5">
        {user ? (
          <NavLink
            to="/create-listing"
            className="font-bold text-blue-500 hover:text-pink-600 hidden sm:block"
          >
            Become A Host
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="font-bold text-blue-500 hover:text-pink-600 hidden sm:block"
          >
            Become A Host
          </NavLink>
        )}
        <div
          onClick={handleClick}
          className="flex items-center h-12 px-3 border border-gray-300 rounded-full bg-white cursor-pointer hover:shadow-md"
        >
          <Menu sx={{ color: "#969393" }} />
          {user ? (
            <img
              src={`https://dreamnest-backend.onrender.com${user.profileImage}`}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full"
            />
          ) : (
            <Person sx={{ color: "#969393" }} />
          )}
        </div>

        {dropdownMenu && !user && (
          <div className="absolute right-14 top-20 flex flex-col w-48 bg-white border border-gray-200 rounded-xl p-2 shadow-lg z-50">
            <NavLink
              to="/login"
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              Log In
            </NavLink>
            <NavLink
              to="/register"
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              Sign Up
            </NavLink>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="absolute right-14 top-20 flex flex-col w-48 bg-white border border-gray-200 rounded-xl p-2 shadow-lg z-50">
            <NavLink
              to={`${user.id}/wishlist`}
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              Wish List
            </NavLink>
            <NavLink
              to={`/${user.id}/myproperties`}
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              My Properties
            </NavLink>
            <NavLink
              to={`${user.id}/reservations`}
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              Reservations
            </NavLink>
            <NavLink
              onClick={handleLogout}
              className="px-3 py-2 text-blue-500 font-bold hover:bg-gray-100 hover:text-pink-600"
            >
              Log Out
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
