import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {
    /* ignore bad JSON */
  }
  return config;
});

// If the token expired, log the user out
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem("user")) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Turn any axios error into a readable message
export const getError = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";

export default api;
