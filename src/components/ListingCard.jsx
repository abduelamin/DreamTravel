/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const ListingCard = ({ listing }) => {
    const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse the photos JSON and extract the `path` field due to the way psql returned them
  const parsedPhotos = listing.photos.map((photo) => {
    try {
    
      const parsedPhoto = JSON.parse(photo);
  
      // Normalize the path by replacing backslashes with forward slashes
      let normalizedPath = parsedPhoto.path.replace(/\\/g, "/");
  
      // Remove the portion of the path. This below portion of the path was an error on my part when handling file uploads. I saved the full path to the db and so when I made my GET req, I could this full path and couldn't display my photos
      normalizedPath = normalizedPath.replace(
        "C:/Users/Home/Desktop/My react projects/FS Real estate app/ElaminEstate-BACKEND/",
        ""
      );
  
      return `http://localhost:8000/uploads/${parsedPhoto.filename}`;
    } catch (error) {
      console.error("Error parsing photo:", error);
      return "";
    }
  });
  

  // Slider functions for navigating between images
  const goToPrevSlide = () => {
    setCurrentIndex(
        /* Each photo has an index. This takes the index and subtracts 1 and adds the length of the photo array to it and then finds the remainder. e.g. Say Im at index 3. If the clicks on the backarrow and we have 6 photos, this will do the following:  (3-1 + 6) / 6.  which is 2 + 6 = 8. 8/6 gives us 2 remainder. Therfore 2 is return and index 2 is shown  
        
        */
      (prev) => (prev - 1 + parsedPhotos.length) % parsedPhotos.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % parsedPhotos.length);
  };

  const takeTolistingDetails = () => {
    navigate(`/properties/${listing.id}`)
  }

  return (
    <div className="relative cursor-pointer p-4 rounded-lg hover:shadow-lg" onClick={takeTolistingDetails}>
      <div className="w-72 overflow-hidden rounded-lg mb-4">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {parsedPhotos.map((photo, index) => (
            <div className="relative flex-shrink-0 w-full h-64" key={index} >
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
