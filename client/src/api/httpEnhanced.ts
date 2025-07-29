// client/src/api/httpEnhanced.ts
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { demoHttpService } from "../services/demoHttp";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Check if we're in demo mode
const isDemoMode = () => {
  return localStorage.getItem('demo_mode') === 'true' || 
         import.meta.env.VITE_DEMO_MODE === 'true' ||
         window.location.search.includes('demo=true');
};

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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
    if (isDemoMode()) {
      localStorage.setItem("demo_authData", JSON.stringify(data));
    } else {
      localStorage.setItem("authData", JSON.stringify(data));
    }
  } else {
    delete http.defaults.headers.common["Authorization"];
    if (isDemoMode()) {
      localStorage.removeItem("demo_authData");
      localStorage.removeItem("demo_current_user");
      localStorage.removeItem("demo_token");
    } else {
      localStorage.removeItem("authData");
    }
  }
};

const initializeAuth = () => {
  const storageKey = isDemoMode() ? "demo_authData" : "authData";
  const authData = localStorage.getItem(storageKey);
  if (!authData) return;

  try {
    const parsedData: AuthData = JSON.parse(authData);
    if (parsedData.token) {
      http.defaults.headers.common["Authorization"] = `Bearer ${parsedData.token}`;
    }
  } catch (error) {
    console.error("Failed to parse auth data:", error);
    localStorage.removeItem(storageKey);
  }
};

initializeAuth();

// Response interceptor for real API
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setAuthData(null);
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          break;
      }

      const serverMessage = error.response.data?.message;
      const statusText = error.response.statusText;
      error.message = serverMessage 
        ? `${statusText}: ${serverMessage}`
        : statusText;
    } else if (error.request) {
      error.message = "Network error - no response received";
    }

    return Promise.reject(error);
  }
);

// Demo API router - routes requests to demo service based on URL patterns
const routeDemoRequest = async (config: AxiosRequestConfig): Promise<any> => {
  const { url = '', method = 'GET', data } = config;
  const cleanUrl = url.replace(/^\/+/, ''); // Remove leading slashes

  try {
    // Auth endpoints
    if (cleanUrl === 'auth/login' && method.toUpperCase() === 'POST') {
      return await demoHttpService.login(data.email, data.password);
    }
    if (cleanUrl === 'auth/register' && method.toUpperCase() === 'POST') {
      return await demoHttpService.register(data);
    }
    if (cleanUrl === 'auth/verify-email' && method.toUpperCase() === 'POST') {
      return await demoHttpService.verifyEmail(data.otp);
    }
    if (cleanUrl === 'auth/forgot-password' && method.toUpperCase() === 'POST') {
      return await demoHttpService.forgotPassword(data.email);
    }
    if (cleanUrl === 'auth/reset-password' && method.toUpperCase() === 'POST') {
      return await demoHttpService.resetPassword(data);
    }
    if (cleanUrl === 'auth/resend-verification' && method.toUpperCase() === 'POST') {
      return await demoHttpService.verifyEmail('demo-otp'); // Auto-success for demo
    }

    // User endpoints
    if (cleanUrl === 'users/me' && method.toUpperCase() === 'GET') {
      return await demoHttpService.getCurrentUser();
    }
    if (cleanUrl === 'users/me' && method.toUpperCase() === 'PUT') {
      const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || '{}');
      return await demoHttpService.updateUser(currentUser._id, data);
    }
    if (cleanUrl.startsWith('users?role=')) {
      const role = cleanUrl.split('role=')[1];
      return await demoHttpService.getUsers(role);
    }
    if (cleanUrl === 'users' && method.toUpperCase() === 'POST') {
      return await demoHttpService.register(data);
    }

    // Analytics endpoints
    if (cleanUrl === 'users/analytics/overview') {
      return await demoHttpService.getAnalytics('overview');
    }
    if (cleanUrl === 'users/analytics/advisor') {
      return await demoHttpService.getAnalytics('advisor');
    }

    // Advising endpoints
    if (cleanUrl === 'advising/my') {
      return await demoHttpService.getAdvisingRequests('my');
    }
    if (cleanUrl === 'advising/pending') {
      return await demoHttpService.getAdvisingRequests('pending');
    }
    if (cleanUrl === 'advising/advisor/my-pending') {
      return await demoHttpService.getAdvisingRequests('advisor/my-pending');
    }
    if (cleanUrl === 'advising' && method.toUpperCase() === 'GET') {
      return await demoHttpService.getAdvisingRequests();
    }
    if (cleanUrl === 'advising' && method.toUpperCase() === 'POST') {
      return await demoHttpService.createAdvisingRequest(data);
    }
    if (cleanUrl.match(/^advising\/[\w-]+\/assign$/) && method.toUpperCase() === 'PATCH') {
      const requestId = cleanUrl.split('/')[1];
      return await demoHttpService.assignAdvisorToRequest(requestId, data.advisorId, data.notes);
    }

    // Course endpoints
    if (cleanUrl.startsWith('courses/programs/')) {
      const program = decodeURIComponent(cleanUrl.split('courses/programs/')[1]);
      return await demoHttpService.getCourses(program);
    }
    if (cleanUrl === 'courses') {
      return await demoHttpService.getCourses();
    }
    if (cleanUrl === 'recommendations') {
      return await demoHttpService.getRecommendations();
    }

    // Registration endpoints
    if (cleanUrl.startsWith('registrations/student/')) {
      const studentId = cleanUrl.split('registrations/student/')[1];
      return await demoHttpService.getRegistrations(studentId);
    }
    if (cleanUrl === 'registrations' && method.toUpperCase() === 'POST') {
      return await demoHttpService.createRegistration(data);
    }
    if (cleanUrl.match(/^registrations\/[\w-]+\/grade$/) && method.toUpperCase() === 'PUT') {
      const registrationId = cleanUrl.split('/')[1];
      return await demoHttpService.updateGrade(registrationId, data);
    }

    // Chat endpoints
    if (cleanUrl === 'chats' && method.toUpperCase() === 'GET') {
      return await demoHttpService.getChats();
    }
    if (cleanUrl === 'chats/start' && method.toUpperCase() === 'POST') {
      return await demoHttpService.startChat(data.advisorId);
    }
    if (cleanUrl.match(/^chats\/[\w-]+$/) && method.toUpperCase() === 'GET') {
      const chatId = cleanUrl.split('/')[1];
      return await demoHttpService.getChat(chatId);
    }
    if (cleanUrl.match(/^chats\/[\w-]+\/messages$/) && method.toUpperCase() === 'POST') {
      const chatId = cleanUrl.split('/')[1];
      return await demoHttpService.sendMessage(chatId, data.content);
    }

    // Default fallback
    console.warn(`Demo endpoint not implemented: ${method} ${cleanUrl}`);
    return Promise.reject({
      response: {
        data: { message: `Demo endpoint not implemented: ${method} ${cleanUrl}` },
        status: 404,
        statusText: 'Not Found'
      }
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Generic request function with demo mode support
async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    let response;
    
    if (isDemoMode()) {
      // Use demo service
      response = await routeDemoRequest(config);
    } else {
      // Use real API
      response = await http.request<ApiResponse<T>>(config);
    }
    
    // Handle response format differences between demo and real API
    if (isDemoMode()) {
      return response.data.data;
    } else {
      return response.data.data;
    }
  } catch (error) {
    throw error;
  }
}

// Enhanced HTTP client with demo mode toggle
const enhancedHttp = {
  ...http,
  isDemoMode,
  toggleDemoMode: (enabled: boolean) => {
    localStorage.setItem('demo_mode', enabled.toString());
    // Clear auth data when switching modes
    setAuthData(null);
    window.location.reload();
  },
  request
};

export { enhancedHttp as http, setAuthData, request };