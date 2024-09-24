/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./utils/Context.jsx";
import Navbar from "./components/Navbar";
import CreateListing from "./pages/CreateListing.jsx";
import ListingDetails from "./pages/ListingDetails.jsx";
import Reservations from "./pages/Reservations.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import MyProperties from "./pages/MyProperties.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/:userId/reservations" element={<Reservations />} />
          <Route path="/:userId/wishlist" element={<Wishlist />} />
          <Route path="/:userId/myproperties" element={<MyProperties />} />
        </Routes>
        <Footer/>
      </UserProvider>
    </>
  );
}

export default App;
