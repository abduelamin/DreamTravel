import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const getListingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/properties/${listingId}`);
          const listingData = response.data;
          
          listingData.photos = listingData.photos.map((photoString) => {
            if (photoString.startsWith("http://") || photoString.startsWith("https://")) {
              return photoString;
            }
            return `http://localhost:8000/uploads/${photoString}`;
          });
  
          setListing(listingData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching listing:', error);
          setLoading(false);
        }
      };
  
      getListingDetails();
    }, [listingId]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!listing) {
      return <div>Listing not found</div>;
    }
  
    return (
      <div className="p-10 lg:p-8 md:p-6 sm:p-5">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-col sm:flex-row sm:items-start gap-4">
            <h1 className="text-3xl font-bold sm:text-2xl">{listing.title}</h1>
            <div className="flex items-center gap-4 cursor-pointer">
              <p className="text-xl font-bold">Save</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl">{listing.description}</p>
          <p className="mt-2">Price: ${listing.price}</p>
          <p>Bedrooms: {listing.bedrooms}</p>
          <p>Bathrooms: {listing.bathrooms}</p>
          <p>Guests: {listing.guests}</p>
        </div>
  
        <div className="mb-8">
          <h3 className="text-xl font-bold">Location:</h3>
          <p>{listing.street_address}, {listing.apt_suite}, {listing.city}, {listing.province}, {listing.country}</p>
        </div>
  
        <div className="mb-8">
          <h3 className="text-xl font-bold">Host:</h3>
          <p>{listing.firstname} {listing.lastname}</p>
          <p>Email: {listing.email}</p>
          {listing.profile_picture_url && (
            <img src={`http://localhost:8000${listing.profile_picture_url}`} alt={`${listing.firstname}'s profile`} className="w-16 h-16 rounded-full" />
          )}
        </div>
  
        <div className="mb-8">
          <h3 className="text-xl font-bold">Photos:</h3>
          <div className="grid grid-cols-2 gap-4">
            {listing.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Listing ${index}`} className="w-full h-64 object-cover rounded-lg" />
            ))}
          </div>
        </div>
  
        <div className="mb-8">
          <h3 className="text-xl font-bold">Facilities:</h3>
          <ul className="list-disc list-inside grid grid-cols-2 gap-4 max-w-lg sm:grid-cols-1">
            {listing.facilities.map((facility, index) => (
              <li key={index} className="text-lg font-semibold">{facility}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default ListingDetails;
