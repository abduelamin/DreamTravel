/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";

// Create the context
export const context = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <context.Provider value={{ user, setUser }}>
      {children}
    </context.Provider>
  );
};