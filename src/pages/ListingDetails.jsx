import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { facilities } from "./../data";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import api from "../utils/api";
import {
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Box,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { context } from "../utils/Context";

const ListingDetails = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const start = dateRange[0]?.startDate
    ? new Date(dateRange[0].startDate)
    : new Date();
  const end = dateRange[0]?.endDate
    ? new Date(dateRange[0].endDate)
    : new Date();
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!listing) {
    return <Typography>Listing not found</Typography>;
  }

  const { user } = useContext(context);
  console.log(user);
  const submitBooking = async () => {
    const bookingForm = {
      customerId: user.id,
      listingId,
      startDate: dateRange[0].startDate.toDateString(),
      endDate: dateRange[0].endDate.toDateString(),
      totalPrice: listing.price * dayCount,
    };
    try {
      const response = await api.post("/createBooking", bookingForm);
      console.log(response.data);
      response.data ? navigate(`/${user.id}/reservations`) : null;
    } catch (error) {
      console.log("Submit Booking Failed:", error.message);
    }
  };

  return (
    <div className="w-screen">
      <Box sx={{ width: "100%", paddingX: 4, paddingY: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            {listing.title}
          </Typography>
          <IconButton color="primary" aria-label="save listing">
            <FavoriteIcon />
            <Typography variant="body1" fontWeight="bold" ml={1}>
              Save
            </Typography>
          </IconButton>
        </Grid>

        <Grid container spacing={2} mt={4}>
          {listing.photos.map((photo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo}
                  alt={`Listing ${index}`}
                  sx={{ borderRadius: 2 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box display="flex" alignItems="center" justifyContent="center">
          {listing.profile_picture_url && (
            <Avatar
              src={`http://localhost:8000${listing.profile_picture_url}`}
              alt={`${listing.firstname}'s profile`}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
          )}
          <Typography variant="h6">
            Hosted by {listing.firstname} {listing.lastname}
            <br />
            Email: {listing.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </Typography>
        <Typography variant="body1">Bedrooms: {listing.bedrooms}</Typography>
        <Typography variant="body1">Bathrooms: {listing.bathrooms}</Typography>
        <Typography variant="body1">Guests: {listing.guests}</Typography>
        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">Description</Typography>
        <Typography variant="body1">{listing.description}</Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">What this place offers</Typography>
        <Grid container spacing={2} mt={2}>
          {listing.facilities.map((item, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
              <Chip
                icon={
                  facilities.find((facility) => facility.name === item)?.icon
                }
                label={item}
                color="primary"
                variant="outlined"
                sx={{ fontSize: 16, padding: 2, width: "100%" }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            How long do you want to stay?
          </Typography>
          <CalendarTodayIcon sx={{ mr: 1 }} />
          <DateRange ranges={dateRange} onChange={handleSelectDates} />

          <Typography variant="h6" mt={2}>
            ${listing.price} x{" "}
            {Math.ceil(
              (dateRange[0].endDate - dateRange[0].startDate) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            nights
          </Typography>
          <Typography variant="h6" color="secondary">
            Total Price: ${listing.price * dayCount}
          </Typography>

          <Button
            onClick={submitBooking}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Confirm Booking
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">Location</Typography>
        <Typography variant="body1">
          {listing.street_address}, {listing.apt_suite}, {listing.city},{" "}
          {listing.province}, {listing.country}
        </Typography>
      </Box>
    </div>
  );
};

export default ListingDetails;
