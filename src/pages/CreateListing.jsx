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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateListing = () => {
  let mycookie = Cookies.get("accessToken");
  //  selection process
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

  const [amenities, setAmenities] = useState([]); // User can select multiple amenities so its in an array to hold many items

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      return setAmenities((prev) =>
        prev.filter((option) => {
          return option !== facility;
        })
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
      const response = await api.post("/create-listing", formData,);
      toast.success(response.data.message , {
        className: 'bg-green-500 text-white',
        bodyClassName: 'text-lg',
        progressClassName: 'bg-green-700',
        autoClose: 3000,
        hideProgressBar: false
      });
    } catch (error) {
      console.error(error);
      if (isTokenExpired(mycookie)) {
        mycookie = createNewAccessToken();
      }
    }
  };

  return (
    <div className="bg-gray-100 p-10 lg:px-20">
      <ToastContainer />
      <h1 className="text-3xl text-blue-600 font-bold">Publish Your Place</h1>
      <form>
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
            Property information
          </h3>
          <div className="flex flex-wrap gap-5 mt-5">
            {["Guests", "Bedrooms", "Beds", "Bathrooms"].map((label) => (
              <div
                key={label}
                className="flex items-center gap-5 p-4 border border-gray-300 rounded-lg"
              >
                <p className="font-semibold">{label}</p>
                <div className="flex items-center gap-2">
                  <RemoveCircleOutline
                    onClick={() => {
                      setCounts((prevCounts) => ({
                        ...prevCounts,
                        [label]: Math.max(prevCounts[label] - 1, 1),
                      }));
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                  <p>{counts[label]}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setCounts((prevCounts) => ({
                        ...prevCounts,
                        [label]: prevCounts[label] + 1,
                      }));
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-8 lg:p-10 rounded-2xl mt-10">
          <h2 className="text-xl text-pink-500 font-semibold">
            Step 2: Make your place stand out
          </h2>
          <hr className="my-6" />
          <h3 className="text-lg text-blue-600 font-semibold">
            What extras does your place have?
          </h3>
          <div className="flex flex-wrap gap-5 mt-5">
            {facilities.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectAmenities(item)}
                className={`flex flex-col justify-center items-center w-48 h-24 border  ${
                  amenities.includes(item)
                    ? " border-pinkred border-4"
                    : "border-gray-300"
                } rounded-lg cursor-pointer transition-all hover:border-pink-500 hover:bg-gray-100`}
              >
                <div className="text-2xl">{item.icon}</div>
                <p className="font-semibold">{item.name}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg text-blue-600 font-semibold mt-10">
            Add some photos of your place
          </h3>
          <DragDropContext onDragEnd={handleDragPhoto}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div
                  className="flex flex-wrap gap-5 mt-5"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {photos.length < 1 && (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                        id="image"
                      />
                      <label
                        htmlFor="image"
                        className="flex flex-col justify-center items-center w-full max-w-lg h-48 border border-dashed border-gray-300 rounded-lg cursor-pointer"
                      >
                        <div className="text-5xl text-gray-400">
                          <IoIosImages />
                        </div>
                        <p className="font-semibold">Upload from your device</p>
                      </label>
                    </>
                  )}
                  {photos.length >= 1 && (
                    <>
                      {photos.map((photo, index) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="relative w-64 h-40 cursor-move"
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                            >
                              <img
                                src={URL.createObjectURL(photo)}
                                alt="place"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute right-2 top-2 bg-white p-1 rounded-full text-xl text-red-500 hover:text-red-700"
                              >
                                <BiTrash />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        multiple
                        id="image"
                      />
                      <label
                        htmlFor="image"
                        className="flex flex-col justify-center items-center w-64 h-40 border border-dashed border-gray-300 rounded-lg cursor-pointer"
                      >
                        <div className="text-5xl text-gray-400">
                          <IoIosImages />
                        </div>
                        <p className="font-semibold">Add more photos</p>
                      </label>
                    </>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <h3 className="text-blue-600 text-xl mt-10 mb-5">
            What makes your place attractive?
          </h3>
          <div className="description">
            <p className="font-semibold">Title</p>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formDescription.title}
              onChange={handleChangeDescription}
              className="border border-gray-300 p-3 rounded-lg w-full"
              required
            />
            <p className="font-semibold mt-5">Description</p>
            <textarea
              placeholder="Description"
              name="description"
              value={formDescription.description}
              onChange={handleChangeDescription}
              rows={5}
              className="border border-gray-300 p-3 rounded-lg w-full"
              required
            />
            <p className="font-semibold mt-5">Highlight</p>
            <input
              type="text"
              placeholder="Highlight"
              name="highlight"
              value={formDescription.highlight}
              onChange={handleChangeDescription}
              className="border border-gray-300 p-3 rounded-lg w-full"
              required
            />
            <p className="font-semibold mt-5">Highlight Details</p>
            <textarea
              placeholder="Highlight Details"
              name="highlightDesc"
              value={formDescription.highlightDesc}
              onChange={handleChangeDescription}
              rows={5}
              className="border border-gray-300 p-3 rounded-lg w-full"
              required
            />
            <p className="font-semibold mt-10">Now, set your PRICE</p>
            <div className="flex items-center mt-3">
              <span className="text-xl font-bold">$</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                className="border border-gray-300 p-3 rounded-lg w-full max-w-xs ml-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-600 text-pinkred px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
