/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Process photos to normalize URLs
  const parsedPhotos = listing.photos.map((photo) => {
    // If the photo is already a full URL, return it as is
    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }
    // Otherwise, treat it as a relative path and prepend your backend URL
    return `https://dreamnest-backend.onrender.com${photo}`;
  });

  // Slider functions for navigating between images
  const goToPrevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + parsedPhotos.length) % parsedPhotos.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % parsedPhotos.length);
  };

  const takeTolistingDetails = () => {
    navigate(`/properties/${listing.id}`);
  };

  return (
    <div className="relative cursor-pointer p-4 rounded-lg hover:shadow-lg" onClick={takeTolistingDetails}>
      <div className="w-72 overflow-hidden rounded-lg mb-4">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {parsedPhotos.map((photo, index) => (
            <div className="relative flex-shrink-0 w-full h-64" key={index}>
              <img
                src={photo}
                alt="Home view"
                className="w-full h-full object-cover filter brightness-90"
              />
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-white z-50"
                onClick={goToPrevSlide}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-white z-50"
                onClick={goToNextSlide}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <h3 className="text-lg font-semibold">{listing.title} </h3>
      {listing.category_name !== 'All' && <p className="text-sm">{listing.category_name}</p>}
      <p className="text-sm">{listing.description}</p>
      <span className="text-lg font-bold">${listing.price}</span>
    </div>
  );
};

export default ListingCard;
