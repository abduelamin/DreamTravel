import axios from "axios";

export default axios.create({
  baseURL: "https://dream-travel-backend.vercel.app/api",
  withCredentials: true,
});
