import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../utils/Context";
import api from "../utils/api";

const MyProperties = () => {
  const { user } = useContext(context);
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await api.get(`/my-properties/${user.id}`);

        const resWithParsedPhotos = response.data.map((listing) => {
          const parsePhoto = listing.photos.map((photo) => {
            const photoObject = JSON.parse(photo);
            return photoObject.filename;
          });
          return { ...listing, photos: parsePhoto };
        });

        setProperties(resWithParsedPhotos);
      } catch (error) {
        console.error("Failed to fetch properties", error.message);
      }
    };

    if (user) fetchMyProperties();
  }, [user]);

  const handleNavigate = (listingId) => {
    navigate(`/properties/${listingId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-screen">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleNavigate(property.id)}
        >
          <img
            src={`https://dreamnest-backend.onrender.com/uploads/${property.photos[0]}`}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{property.title}</h3>
            <p className="text-gray-700 mb-2">{property.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-600">
                ${property.price}
              </span>
              <span className="text-sm text-gray-500">
                Beds: {property.beds} | Baths: {property.bathrooms}
              </span>
            </div>
            <button className="mt-2 text-white bg-blue-500 hover:bg-blue-600 transition duration-200 px-4 py-2 rounded">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProperties;
