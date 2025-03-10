import axios from "axios";

export default axios.create({
  baseURL: "dream-travel-backend.vercel.app/api",
  withCredentials: true,
});
