/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../utils/signUp";
import image from "../assets/addImage.png";
import backgroundImage from "../assets/register.jpg";

const RegisterPage = () => {
  const schema = z
    .object({
      firstname: z.string().min(3, "First name must be at least 3 characters"),
      lastname: z.string().min(3, "Last name must be at least 3 characters"),
      email: z
        .string()
        .email({ message: "Please write a valid email address" }),
      password: z
        .string()
        .min(8, { message: "Must contain a minimum of 8 characters" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (data) => {
    try {
      const response = await signUp(data, profileImage);
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
          <div>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              type="text"
              placeholder="First Name"
              {...register("firstname")}
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstname.message}
              </p>
            )}
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              type="text"
              placeholder="Last Name"
              {...register("lastname")}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <label
              className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-full cursor-pointer overflow-hidden"
              htmlFor="image"
            >
              <img
                src={imagePreview || image}
                alt="Profile Preview"
                className="w-full h-full object-cover object-center"
              />
              {!imagePreview || image && (
                <p className="text-sm text-gray-500 mt-2">Upload Photo</p>
              )}
            </label>
            <input
              id="image"
              name="profileImage"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            className="w-full py-3 mt-6 font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300"
            type="submit"
          >
            REGISTER
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <NavLink
            className="text-purple-600 font-bold hover:underline"
            to="/login"
          >
            Log in Here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
