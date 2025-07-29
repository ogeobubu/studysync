// client/src/context/AuthContext.tsx
import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpService from '../api/httpService';
import { Role } from "../types";
import type { User, AuthContextType } from "../types";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isDemoMode = httpService.isDemoMode();
        const storedToken = isDemoMode 
          ? localStorage.getItem('demo_token')
          : localStorage.getItem('authToken');

        if (storedToken) {
          const parsedToken = JSON.parse(storedToken);
          setToken(parsedToken);

          if (isDemoMode) {
            // For demo mode, get user from localStorage
            const storedUser = localStorage.getItem('demo_current_user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log('Demo user restored:', parsedUser);
            } else {
              // Demo token exists but no user - clear the token
              httpService.clearAuth();
            }
          } else {
            // For real API, fetch user data
            try {
              const response = await httpService.get('/users/me');
              setUser(response.data.data);
              console.log('Real user fetched:', response.data);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              httpService.clearAuth();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        httpService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await httpService.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;

      console.log('Login response:', response.data);
      
      // Store auth data
      httpService.setAuth(newToken, newUser);
      setToken(newToken);
      setUser(newUser);

      // Show success message
      toast.success(httpService.isDemoMode() ? 'Demo login successful!' : 'Login successful!');

      // Redirect based on role
      const redirectMap = {
        [Role.ADMIN]: '/admin/dashboard',
        [Role.ADVISOR]: '/advisor/dashboard',
        [Role.STUDENT]: '/student/dashboard',
      };

      const redirectPath = redirectMap[newUser.role as Role] || '/login';
      navigate(redirectPath);
      
    } catch (error: any) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.data?.message) {
        errorMessage = error.response.data.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    httpService.clearAuth();
    setUser(null);
    setToken(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};