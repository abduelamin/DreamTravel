/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const parsedPhotos = listing.photos.map((photo) => {
    return photo
  });

  // Slider functions for navigating between images
  const goToPrevSlide = (e) => {
    e.stopPropagation()
    setCurrentIndex(
      (prev) => (prev - 1 + parsedPhotos.length) % parsedPhotos.length
    );
  };

  const goToNextSlide = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % parsedPhotos.length);
  };

  const takeTolistingDetails = () => {
    navigate(`/properties/${listing.id}`);
  };

  return (
    <div className="relative cursor-pointer p-4 rounded-lg hover:shadow-lg w-full max-w-xs" onClick={takeTolistingDetails}>
      <div className="w-full h-64 overflow-hidden rounded-lg mb-4 relative">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {parsedPhotos.map((photo, index) => (
            <div className="relative flex-shrink-0 w-full h-full" key={index}>
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

      <div className="w-full">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        {listing.category_name !== 'All' && (
          <p className="text-sm text-gray-500">{listing.category_name}</p>
        )}
        <p className="text-sm text-gray-700">{listing.description}</p>
        <span className="text-lg font-bold text-blue-600">${listing.price}</span>
      </div>
    </div>
  );
};

export default ListingCard;