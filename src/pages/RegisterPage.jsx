/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../utils/signUp";
import image from "../assets/uploadPhoto.png";
import backgroundImage from '../assets/register.jpg'

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

  // Handles the image selected and passing it to the state that will be passed to signUP. In addition to giving an image preview to the client to show that their image has been uploaed
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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col gap-4 w-4/5 lg:w-3/5 mm:w-4/5 p-10 bg-black bg-opacity-50 rounded-2xl">
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <input
            className="w-full p-2 bg-transparent border-b border-white/30 text-center text-white placeholder-white focus:outline-none"
            type="text"
            name="firstname"
            placeholder="First Name"
            {...register("firstname")}
          />
          {errors.firstname && <p className="text-red-300">{errors.firstname.message}</p>}
  
          <input
            className="w-full p-2 bg-transparent border-b border-white/30 text-center text-white placeholder-white focus:outline-none"
            type="text"
            name="lastname"
            placeholder="Last Name"
            {...register("lastname")}
          />
          {errors.lastname && <p className="text-red-300">{errors.lastname.message}</p>}
  
          <input
            className="w-full p-2 bg-transparent border-b border-white/30 text-center text-white placeholder-white focus:outline-none"
            type="email"
            name="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p className="text-red-300">{errors.email.message}</p>}
  
          <input
            className="w-full p-2 bg-transparent border-b border-white/30 text-center text-white placeholder-white focus:outline-none"
            type="password"
            name="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <p className="text-red-300">{errors.password.message}</p>}
  
          <input
            className="w-full p-2 bg-transparent border-b border-white/30 text-center text-white placeholder-white focus:outline-none"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p className="text-red-300">{errors.confirmPassword.message}</p>}
          
          <label
            className="flex flex-col justify-center items-center gap-2 cursor-pointer text-white text-sm"
            htmlFor="image"
          >
            <img src={imagePreview || image} alt="User profile image" className="w-12 rounded-lg" />
            <p>Upload Profile Photo</p>
          </label>
          <input
            id="image"
            name="profileImage"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
  
          <button className="btn" type="submit">
            REGISTER
          </button>
        </form>
        <NavLink
          className="text-white text-sm mt-2 text-center hover:underline"
          to="/login"
        >
          Already have an account? Log in Here
        </NavLink>
      </div>
    </div>
  );
};

export default RegisterPage;
