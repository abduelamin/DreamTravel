/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { context } from "../utils/Context.jsx";

const LoginPage = () => {
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(context)
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormInput((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", formInput, {
        withCredentials: true,
      });
  
      // Attempt to get the access token from cookies first
      const accessToken = Cookies.get("accessToken") || response.data.accessToken;
  
      if (accessToken) {
        // Store in local storage as a fallback
        localStorage.setItem("accessToken", accessToken);
        const decodedUser = jwtDecode(accessToken);
        setUser(decodedUser);
        navigate("/");
        setError(null);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
      setFormInput({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formInput.email}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formInput.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-600">
          Don't have an account?
          <NavLink to="/register" className="text-indigo-600 font-bold ml-2">
            Register Here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
