import React, { useEffect, useState } from "react";
import Loader from "./../components/Loader";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const Reservations = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [userTrips, setUserTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/${userId}/myBookingsWithDetails`);
        console.log("Reservations:", response.data);
        if (response.data) {
          const tripsWithParsedPhotos = response.data.map((trip) => {
            return {
              ...trip,
              photos: trip.photos.map((photo) => {
                try {
                  // Remove "http://localhost:8000/uploads/" or similar unwanted parts
                  let cleanPhotoUrl = photo.replace("http://localhost:8000", "");
  
                  // Ensure the photo URL starts with '/uploads/'
                  if (!cleanPhotoUrl.startsWith("/uploads/")) {
                    cleanPhotoUrl = `/uploads/${cleanPhotoUrl}`;
                  }
  
                  // Return the final URL with the backend URL prepended
                  return `https://dreamnest-backend.onrender.com${cleanPhotoUrl}`;
                } catch (error) {
                  console.error("Error parsing photo:", error);
                  return "";
                }
              }),
            };
          });
  
          setUserTrips(tripsWithParsedPhotos);
          setLoading(false);
        }
      } catch (error) {
        console.error("Client Error:", error.message);
      }
    };
  
    fetchBookings();
  }, [userId]);

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState({});

  const handleNext = (index) => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [index]:
        (prev[index] ?? 0) + 1 < userTrips[index].photos.length
          ? (prev[index] ?? 0) + 1
          : 0,
    }));
  };

  const handlePrev = (index) => {
    setCurrentPhotoIndex((prev) => ({
      ...prev,
      [index]:
        (prev[index] ?? 0) - 1 >= 0
          ? (prev[index] ?? 0) - 1
          : userTrips[index].photos.length - 1,
    }));
  };

  const handleClick = (tripId) => {
    navigate(`/properties/${tripId}`);
  };
  if (loading) return <Loader />;

  return (
    <div className="bg-gray-100 min-h-screen p-6 w-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Your Reservations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
        {userTrips.map((trip, index) => (
          <div
            key={trip.booking_id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="relative w-full h-64">
              <img
                onClick={() => handleClick(trip.listing_id)}
                src={trip.photos[currentPhotoIndex[index] ?? 0]}
                alt={trip.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              {trip.photos.length > 1 && (
                <>
                  <button
                    onClick={() => handlePrev(index)}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleNext(index)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{trip.title}</h2>
              <p className="text-gray-600">
                Stay from: {new Date(trip.start_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Stay until: {new Date(trip.end_date).toLocaleDateString()}
              </p>
              <p className="text-lg font-bold text-blue-600">
                Total Price: ${trip.total_price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
