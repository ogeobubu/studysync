import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthData = (data: { token: string } | null) => {
  if (data) {
    http.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("authData", JSON.stringify(data));
  } else {
    delete http.defaults.headers.common["Authorization"];
    localStorage.removeItem("authData");
  }
};

const initializeAuth = () => {
  const authData = localStorage.getItem("authToken");
  if (!authData) {
    return;
  }
  try {
    const parsedData = JSON.parse(authData);
    http.defaults.headers.common["Authorization"] = `Bearer ${parsedData}`;
  } catch (error) {
    localStorage.removeItem("authData");
  }
};

initializeAuth();

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      setAuthData(null);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { http, setAuthData };
