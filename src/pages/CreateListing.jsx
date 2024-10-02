/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import api from "../utils/api";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import Cookies from "js-cookie";
import { isTokenExpired } from "./../utils/isTokenExpired";
import { createNewAccessToken } from "./../utils/newToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
  const navigate = useNavigate();
  let mycookie = Cookies.get("accessToken");

  // Selection process
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  // Location function
  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormLocation((prev) => ({ ...prev, [name]: value }));
  };

  // Count section: bedroom, rooms etc...
  const [counts, setCounts] = useState({
    Guests: 1,
    Bedrooms: 1,
    Beds: 1,
    Bathrooms: 1,
  });

  // Amenities section:
  const [amenities, setAmenities] = useState([]);

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      return setAmenities((prev) =>
        prev.filter((option) => option !== facility)
      );
    }
    return setAmenities((prev) => [...prev, facility]);
  };

  // Drop and drag photos section
  const [photos, setPhotos] = useState([]);

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Description section
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category", category);
    formData.append("type", type);
    formData.append("location", JSON.stringify(formLocation));
    formData.append("counts", JSON.stringify(counts));
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("description", JSON.stringify(formDescription));

    // Append each file to FormData
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const response = await api.post("/create-listing", formData);
      console.log(response.data);
      if (response.data.message) {
        toast.success(response.data.message, {
          className: "bg-green-500 text-white",
          bodyClassName: "text-lg",
          progressClassName: "bg-green-700",
          autoClose: 3000,
          hideProgressBar: false,
        });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the form", {
        className: "bg-red-500 text-white",
        bodyClassName: "text-lg",
        progressClassName: "bg-red-700",
        autoClose: 3000,
        hideProgressBar: false,
      });

      if (isTokenExpired(mycookie)) {
        mycookie = createNewAccessToken();
      }
    }
  };

  return (
    <div className="bg-gray-100 w-screen p-10 lg:px-20">
      <ToastContainer />
      <h1 className="text-3xl text-blue-600 font-bold">Publish Your Place</h1>
      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        <div className="bg-white p-8 lg:p-10 rounded-2xl mt-10">
          <h2 className="text-xl text-pink-500 font-semibold">
            Step 1: Tell us about your place
          </h2>
          <hr className="my-6" />
          <h3 className="text-lg text-blue-600 font-semibold">
            Which of these categories best describes your place?
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-5 mt-5">
            {categories.map((item, index) => (
              <div
                key={index}
                onClick={() => setCategory(item.label)}
                className={`flex flex-col justify-center items-center w-28 h-24 border $ rounded-lg cursor-pointer transition-all hover:border-pink-500 hover:bg-gray-100 ${
                  category === item.label
                    ? "border-pinkred border-4"
                    : "border-gray-300"
                }`}
              >
                <div className="text-2xl">{item.icon}</div>
                <p className="font-semibold text-center text-black">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            What type of place will guests have?
          </h3>
          <div className="flex flex-col gap-5 mt-5">
            {types.map((item, index) => (
              <div
                key={index}
                onClick={() => setType(item.name)}
                className={`flex justify-between items-center max-w-lg p-4 border ${
                  type === item.name
                    ? " border-pinkred border-4"
                    : "border-gray-300"
                } rounded-lg cursor-pointer transition-all hover:border-pink-500 hover:bg-gray-100`}
              >
                <div>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="text-2xl">{item.icon}</div>
              </div>
            ))}
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Where is your place located?
          </h3>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-semibold">Street Address</p>
              <input
                type="text"
                placeholder="Street Address"
                name="streetAddress"
                value={formLocation.streetAddress}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 p-4 rounded-lg"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="font-semibold">
                  Apartment, Suite etc... (if applicable)
                </p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc..."
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleLocationChange}
                  className="w-full border border-gray-300 p-4 rounded-lg"
                  required
                />
              </div>
              <div>
                <p className="font-semibold">City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleLocationChange}
                  className="w-full border border-gray-300 p-4 rounded-lg"
                  required
                />
              </div>
              <div>
                <p className="font-semibold">Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleLocationChange}
                  className="w-full border border-gray-300 p-4 rounded-lg"
                  required
                />
              </div>
              <div>
                <p className="font-semibold">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleLocationChange}
                  className="w-full border border-gray-300 p-4 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            How many guests would you like to welcome?
          </h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.keys(counts).map((key) => (
              <div key={key}>
                <p className="font-semibold">{key}</p>
                <div className="flex items-center gap-5">
                  <RemoveCircleOutline
                    className="cursor-pointer"
                    onClick={() =>
                      setCounts((prev) => ({
                        ...prev,
                        [key]: Math.max(prev[key] - 1, 1),
                      }))
                    }
                  />
                  <span>{counts[key]}</span>
                  <AddCircleOutline
                    className="cursor-pointer"
                    onClick={() =>
                      setCounts((prev) => ({
                        ...prev,
                        [key]: prev[key] + 1,
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            What amenities do you offer?
          </h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className={`p-4 border ${
                  amenities.includes(facility)
                    ? "border-pinkred border-4"
                    : "border-gray-300"
                } rounded-lg cursor-pointer transition-all hover:border-pink-500 hover:bg-gray-100`}
                onClick={() => handleSelectAmenities(facility)}
              >
                <p className="font-semibold">{facility}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Add photos of your place
          </h3>
          <div className="mt-5">
            <label
              htmlFor="photos"
              className="flex flex-col items-center justify-center border border-dashed p-10 w-full rounded-xl cursor-pointer hover:bg-gray-100"
            >
              <IoIosImages className="text-4xl text-blue-600" />
              <p className="font-semibold mt-3">Upload Photos</p>
              <input
                id="photos"
                type="file"
                multiple
                onChange={handleUploadPhotos}
                className="hidden"
              />
            </label>
          </div>

          {photos.length > 0 && (
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <ul
                    className="flex mt-5 space-x-5 overflow-x-auto"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.map((photo, index) => (
                      <Draggable
                        key={index}
                        draggableId={`photo-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            className="relative"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <img
                              src={URL.createObjectURL(photo)}
                              alt="Uploaded"
                              className="h-40 w-40 object-cover rounded-lg"
                            />
                            <button
                              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg"
                              onClick={() => handleRemovePhoto(index)}
                              type="button"
                            >
                              <BiTrash className="text-red-600" />
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 lg:p-10 rounded-2xl mt-10">
          <h2 className="text-xl text-pink-500 font-semibold">
            Step 2: Describe your place
          </h2>
          <hr className="my-6" />
          <h3 className="text-lg text-blue-600 font-semibold">Title</h3>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={formDescription.title}
            onChange={handleChangeDescription}
            className="w-full border border-gray-300 p-4 rounded-lg"
            required
          />

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Description
          </h3>
          <textarea
            placeholder="Write a short summary of your place"
            name="description"
            value={formDescription.description}
            onChange={handleChangeDescription}
            className="w-full border border-gray-300 p-4 rounded-lg"
            rows="4"
            required
          />

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Highlight your listing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <p className="font-semibold">Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                className="w-full border border-gray-300 p-4 rounded-lg"
                required
              />
            </div>
            <div>
              <p className="font-semibold">Highlight Description</p>
              <input
                type="text"
                placeholder="Highlight Description"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                className="w-full border border-gray-300 p-4 rounded-lg"
                required
              />
            </div>
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Price Per Night
          </h3>
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={formDescription.price}
            onChange={handleChangeDescription}
            className="w-full border border-gray-300 p-4 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-10 py-4 rounded-full mt-10"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
