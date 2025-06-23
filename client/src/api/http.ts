import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Type for auth data
interface AuthData {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const setAuthData = (data: AuthData | null) => {
  if (data) {
    http.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    localStorage.setItem("authData", JSON.stringify(data));
  } else {
    delete http.defaults.headers.common["Authorization"];
    localStorage.removeItem("authData");
  }
};

const initializeAuth = () => {
  const authData = localStorage.getItem("authData");
  if (!authData) return;

  try {
    const parsedData: AuthData = JSON.parse(authData);
    if (parsedData.token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${parsedData.token}`;
    }
  } catch (error) {
    console.error("Failed to parse auth data:", error);
    localStorage.removeItem("authData");
  }
};

initializeAuth();

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    // You can transform the response data here if needed
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          setAuthData(null);
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Handle forbidden access
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server errors
          break;
      }

      // Create a more detailed error message
      const serverMessage = error.response.data?.message;
      const statusText = error.response.statusText;
      error.message = serverMessage 
        ? `${statusText}: ${serverMessage}`
        : statusText;
    } else if (error.request) {
      // The request was made but no response was received
      error.message = "Network error - no response received";
    }

    return Promise.reject(error);
  }
);

// Generic request function with TypeScript support
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await http.request<ApiResponse<T>>(config);
    return response.data.data;
  } catch (error) {
    // You can add additional error handling here if needed
    throw error;
  }
}

export { http, setAuthData, request };