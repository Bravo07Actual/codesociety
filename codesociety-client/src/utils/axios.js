import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // allows cookies to be sent (important for auth)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
