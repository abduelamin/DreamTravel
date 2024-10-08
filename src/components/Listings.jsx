/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { categories } from "../data";
import Loader from "./Loader";
import api from "../utils/api";
import ListingCard from "./ListingCard";

const Listings = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/listings?category=${selectedCategory}`
        );
        setListings(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory]);

  return (
    <div>
      <div className="category-list w-screen px-20 py-12 sm:px-5 flex justify-center flex-wrap gap-15">
        {categories.map((item, index) => (
          <div
            className={`category flex flex-col items-center text-darkgrey cursor-pointer ml-4 hover:text-pink-500`}
            key={index}
            onClick={() => setSelectedCategory(item.label)}
          >
            <div className="category_icon text-3xl">{item.icon}</div>
            <p className="text-lg font-bold">{item.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader /> 
      ) : (
        <div className="listings w-screen px-20 py-12 sm:px-5 flex justify-center flex-wrap gap-5">
          {listings.length > 0 ? (
            listings.map((listing, index) => (
              <div key={index} className="listing-item">
                <ListingCard listing={listing}/>
              </div>
            ))
          ) : (
            <p>No listings available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Listings;
