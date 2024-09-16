import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { facilities } from "./../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

const ListingDetails = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListingDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/properties/${listingId}`
        );
        const listingData = response.data;

        // Parse facilities
        listingData.facilities = listingData.facilities.map(
          (facilityString) => {
            try {
              const facilityObj = JSON.parse(facilityString);
              return facilityObj.name;
            } catch (err) {
              console.error("Error parsing facility:", err.message);
              return facilityString;
            }
          }
        );

        // Handle photo URLs
        listingData.photos = listingData.photos.map((photoString) => {
          if (
            photoString.startsWith("http://") ||
            photoString.startsWith("https://")
          ) {
            return photoString;
          }
          return `http://localhost:8000/uploads/${photoString}`;
        });

        setListing(listingData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setLoading(false);
      }
    };

    getListingDetails();
  }, [listingId]);

  // Calendar date selection feature
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelectDates = (ranges) => {
    if (ranges && ranges.selection) {
      const { startDate, endDate } = ranges.selection;
  
      setDateRange([
        {
          startDate: startDate || new Date(),  
          endDate: endDate || new Date(),      
          key: "selection",
        },
      ]);
    } else {
      console.error("Invalid date range selection");
    }
  };

  const start = dateRange[0]?.startDate ? new Date(dateRange[0].startDate) : new Date();
  const end = dateRange[0]?.endDate ? new Date(dateRange[0].endDate) : new Date();
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24)); 
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="p-10 lg:p-8 md:p-6 sm:p-5 w-screen " >
      <div className="mb-8">
        <div className="flex justify-between items-center flex-col sm:flex-row sm:items-start gap-4">
          <h1 className="text-3xl font-bold sm:text-2xl">{listing.title}</h1>
          <div className="flex items-center gap-4 cursor-pointer">
            <p className="text-xl font-bold">Save</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold">Photos:</h3>
          <div className="grid grid-cols-2 gap-4">
            {listing.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Listing ${index}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>Bedrooms: {listing.bedrooms}</p>
        <p>Bathrooms: {listing.bathrooms}</p>
        <p>Guests: {listing.guests}</p>
      </div>

      <hr />
      <div className="flex gap-5 items-center mb-5">
        {listing.profile_picture_url && (
          <img
            src={`http://localhost:8000${listing.profile_picture_url}`}
            alt={`${listing.firstname}'s profile`}
            className="w-16 h-16 rounded-full"
          />
        )}
        <h3 className="text-xl font-bold">
          Hosted by {listing.firstname} {listing.lastname}
        </h3>
        <p>Email: {listing.email}</p>
      </div>

      <hr />

      <h3 className="text-xl font-bold">Description</h3>
      <p className="mt-4">{listing.description}</p>
      <hr />

      <h3 className="text-xl font-bold">{listing.highlight}</h3>
      <p>{listing.highlightDesc}</p>
      <hr />

      <div className="booking flex flex-col lg:flex-row justify-between gap-10 lg:gap-5">
        <div className="amenities grid grid-cols-2 gap-x-5 sm:gap-x-2">
          {listing.facilities.map((item, index) => (
            <div className="facility flex items-center gap-5 font-semibold text-lg mb-5" key={index}>
              <div className="facility_icon text-2xl">
                {facilities.find((facility) => facility.name === item)?.icon}
              </div>
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-5">How long do you want to stay?</h2>
          <DateRange ranges={dateRange} onChange={handleSelectDates} />
          <h2 className="text-lg mt-3">
            ${listing.price} x {dayCount} {dayCount > 1 ? "nights" : "night"}
          </h2>
          <h2 className="text-lg font-bold">
            Total Price: ${listing.price * dayCount}
          </h2>
          <p>Check-In: {dateRange[0].startDate.toDateString()}</p>
          <p>Check-Out: {dateRange[0].endDate.toDateString()}</p>
          <button className="mt-5 w-full lg:w-auto px-5 py-3 bg-blue-500 text-white rounded-lg">
            Confirm Booking
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold">Location:</h3>
        <p>
          {listing.street_address}, {listing.apt_suite}, {listing.city},{" "}
          {listing.province}, {listing.country}
        </p>
      </div>
    </div>
  );
};

export default ListingDetails;