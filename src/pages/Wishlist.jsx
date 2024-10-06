import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../utils/Context";
import api from "../utils/api";

const Wishlist = () => {
  const { user } = useContext(context);
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const response = await api.get(`/wishlist/${user.id}`);
        console.log("wishlist:", response.data);
  
      
          setFavourites(response.data);
        } catch (error) {
          console.log("Failed to fetch wishlist", error.message);
        }
      };

    fetchWishList();
  }, [user]);

  const handleNavigate = (listingId) => {
    navigate(`/properties/${listingId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 w-full max-w-screen-xl mx-auto">
      {favourites.map((fav) => (
        <div
          key={fav.id}
          className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer group"
          onClick={() => handleNavigate(fav.id)}
        >
          <div className="relative">
            <img
              src={fav.photos[0]} 
              alt={fav.title}
              className="w-full h-56 object-cover transition duration-500 transform group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent opacity-75 w-full h-2/3"></div>
            <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-lg z-10">
              {fav.title}
            </h3>
          </div>
          <div className="p-5">
            <p className="text-gray-600 line-clamp-2 mb-3">{fav.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-blue-600">${fav.price}</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                {fav.beds} Beds • {fav.bathrooms} Baths
              </span>
            </div>
            <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition duration-300 transform hover:translate-y-1 hover:shadow-lg">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
