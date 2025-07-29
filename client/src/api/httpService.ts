// client/src/api/httpService.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { demoHttpService } from '../services/demoHttp';
import { initializeDemoData } from '../services/demoData';

// Initialize demo data when service loads
initializeDemoData();

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

class HttpService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for real API only
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Demo mode detection
  isDemoMode(): boolean {
    return localStorage.getItem('demo_mode') === 'true' || 
           import.meta.env.VITE_DEMO_MODE === 'true' ||
           window.location.search.includes('demo=true');
  }

  // Auth management
  private getToken(): string | null {
    const key = this.isDemoMode() ? 'demo_token' : 'authToken';
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  setAuth(token: string, user?: any): void {
    const key = this.isDemoMode() ? 'demo_token' : 'authToken';
    localStorage.setItem(key, JSON.stringify(token));
    
    if (user) {
      const userKey = this.isDemoMode() ? 'demo_current_user' : 'current_user';
      localStorage.setItem(userKey, JSON.stringify(user));
      
      // Also set demo_authData for consistency
      if (this.isDemoMode()) {
        localStorage.setItem('demo_authData', JSON.stringify({ token, user }));
      }
    }
  }

  clearAuth(): void {
    if (this.isDemoMode()) {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('demo_current_user');
      localStorage.removeItem('demo_authData');
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('current_user');
      localStorage.removeItem('authData');
    }
  }

  // Main request method
  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.isDemoMode()) {
      return this.handleDemoRequest<T>(config);
    } else {
      return this.handleRealRequest<T>(config);
    }
  }

  // Demo request handler
  private async handleDemoRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const { url = '', method = 'GET', data } = config;
    const cleanUrl = url.replace(/^\/+/, '');

    console.log(`[DEMO] ${method.toUpperCase()} /${cleanUrl}`, data || '');

    try {
      let response;

      // Route to appropriate demo service method
      switch (true) {
        // Auth endpoints
        case cleanUrl === 'auth/login' && method.toUpperCase() === 'POST':
          response = await demoHttpService.login(data.email, data.password);
          break;
        case cleanUrl === 'auth/register' && method.toUpperCase() === 'POST':
          response = await demoHttpService.register(data);
          break;
        case cleanUrl === 'auth/verify-email' && method.toUpperCase() === 'POST':
          response = await demoHttpService.verifyEmail(data.otp);
          break;
        case cleanUrl === 'auth/forgot-password' && method.toUpperCase() === 'POST':
          response = await demoHttpService.forgotPassword(data.email);
          break;
        case cleanUrl === 'auth/reset-password' && method.toUpperCase() === 'POST':
          response = await demoHttpService.resetPassword(data);
          break;

        // User endpoints
        case cleanUrl === 'users/me' && method.toUpperCase() === 'GET':
          response = await demoHttpService.getCurrentUser();
          break;
        case cleanUrl === 'users/me' && method.toUpperCase() === 'PUT':
          const currentUser = JSON.parse(localStorage.getItem('demo_current_user') || '{}');
          response = await demoHttpService.updateUser(currentUser._id, data);
          break;
        case cleanUrl.startsWith('users?role='):
          const role = cleanUrl.split('role=')[1];
          response = await demoHttpService.getUsers(role);
          break;
        case cleanUrl === 'users' && method.toUpperCase() === 'POST':
          response = await demoHttpService.register(data);
          break;

        // Analytics
        case cleanUrl === 'users/analytics/overview':
          response = await demoHttpService.getAnalytics('overview');
          break;
        case cleanUrl === 'users/analytics/advisor':
          response = await demoHttpService.getAnalytics('advisor');
          break;

        // Advising
        case cleanUrl === 'advising/my':
          response = await demoHttpService.getAdvisingRequests('my');
          break;
        case cleanUrl === 'advising/pending':
          response = await demoHttpService.getAdvisingRequests('pending');
          break;
        case cleanUrl === 'advising/advisor/my-pending':
          response = await demoHttpService.getAdvisingRequests('advisor/my-pending');
          break;
        case cleanUrl === 'advising' && method.toUpperCase() === 'GET':
          response = await demoHttpService.getAdvisingRequests();
          break;
        case cleanUrl === 'advising' && method.toUpperCase() === 'POST':
          response = await demoHttpService.createAdvisingRequest(data);
          break;
        case cleanUrl.match(/^advising\/[\w-]+\/assign$/) && method.toUpperCase() === 'PATCH':
          const requestId = cleanUrl.split('/')[1];
          response = await demoHttpService.assignAdvisorToRequest(requestId, data.advisorId, data.notes);
          break;

        // Courses
        case cleanUrl.startsWith('courses/programs/'):
          const program = decodeURIComponent(cleanUrl.split('courses/programs/')[1]);
          response = await demoHttpService.getCourses(program);
          break;
        case cleanUrl === 'courses':
          response = await demoHttpService.getCourses();
          break;
        case cleanUrl === 'recommendations':
          response = await demoHttpService.getRecommendations();
          break;

        // Registrations
        case cleanUrl.startsWith('registrations/student/'):
          const studentId = cleanUrl.split('registrations/student/')[1];
          response = await demoHttpService.getRegistrations(studentId);
          break;
        case cleanUrl === 'registrations' && method.toUpperCase() === 'POST':
          response = await demoHttpService.createRegistration(data);
          break;
        case cleanUrl.match(/^registrations\/[\w-]+\/grade$/) && method.toUpperCase() === 'PUT':
          const regId = cleanUrl.split('/')[1];
          response = await demoHttpService.updateGrade(regId, data);
          break;

        // Chats
        case cleanUrl === 'chats' && method.toUpperCase() === 'GET':
          response = await demoHttpService.getChats();
          break;
        case cleanUrl === 'chats/start' && method.toUpperCase() === 'POST':
          response = await demoHttpService.startChat(data.advisorId);
          break;
        case cleanUrl.match(/^chats\/[\w-]+$/) && method.toUpperCase() === 'GET':
          const chatId = cleanUrl.split('/')[1];
          response = await demoHttpService.getChat(chatId);
          break;
        case cleanUrl.match(/^chats\/[\w-]+\/messages$/) && method.toUpperCase() === 'POST':
          const chatId2 = cleanUrl.split('/')[1];
          response = await demoHttpService.sendMessage(chatId2, data.content);
          break;

        default:
          throw new Error(`Demo endpoint not implemented: ${method.toUpperCase()} /${cleanUrl}`);
      }

      // Ensure consistent response format
      return {
        data: response.data,
        message: response.message || 'Success',
        success: true
      };
    } catch (error: any) {
      console.error('[DEMO] Request failed:', error);
      throw error;
    }
  }

  // Real API request handler
  private async handleRealRequest<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.request(config);
     return {
        data: response.data,
        message: response.message || 'Success',
        success: true
      };
    } catch (error: any) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }

  // Convenience methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Demo mode toggle
  toggleDemoMode(enabled: boolean): void {
    localStorage.setItem('demo_mode', enabled.toString());
    this.clearAuth();
    
    if (enabled) {
      initializeDemoData();
    }
    
    console.log(`Demo mode ${enabled ? 'enabled' : 'disabled'}`);
    window.location.reload();
  }
}

// Export singleton instance
export const httpService = new HttpService();
export default httpService;