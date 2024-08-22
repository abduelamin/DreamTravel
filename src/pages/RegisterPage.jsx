/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../utils/signUp";

const schema = z
  .object({
    firstName: z.string().min(4, "First name must be at least 4 characters"),
    lastName: z.string().min(4, "Last name must be at least 4 characters"),
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

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [profileImage, setProfileImage] = useState(null);

  const onFormSubmit = async (data) => {
    try {
      const response = await signUp(data, profileImage);
      console.log(response.data);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="register">
      <div className="registerContent">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            {...register("firstName")}
          />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            {...register("lastName")}
          />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          <input
            type="file"
            placeholder="Add your avatar"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <button type="submit">REGISTER</button>
        </form>
        <NavLink to="/login">Already have an account? Log in Here</NavLink>
      </div>
    </div>
  );
};

export default RegisterPage;
