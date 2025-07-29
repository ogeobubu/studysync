import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { http, setAuthData } from "../api/httpEnhanced";
import { useHttp } from "../api/useHttp"
import { jwtDecode } from 'jwt-decode';
import { Role } from "../types";
import type { User, AuthContextType, JwtPayload } from "../types";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const isDemo = http.isDemoMode();
      const tokenKey = isDemo ? 'demo_token' : 'authToken';
      const storedToken = localStorage.getItem(tokenKey);

      if (storedToken) {
        try {
          if (isDemo) {
            // For demo mode, get user from demo storage
            const demoUser = JSON.parse(localStorage.getItem('demo_current_user') || 'null');
            if (demoUser) {
              setToken(storedToken);
              setUser(demoUser);
              setAuthData({ token: storedToken });
            }
          } else {
            // For real mode, decode JWT and fetch user
            const decoded = jwtDecode<JwtPayload>(JSON.parse(storedToken));
            setToken(JSON.parse(storedToken));
            setAuthData({ token: JSON.parse(storedToken) });

            if (!user) {
              const response = await http.get('/users/me');
              setUser(response.data.data);
            }
          }
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem(tokenKey);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [user]);

  const { mutate: loginUser } = useHttp<{ token: string; user: User }, { email: string; password: string }>({
    url: '/auth/login',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        const { token, user } = data;
        setUser(user);
        setToken(token);
        
        const isDemo = http.isDemoMode();
        const tokenKey = isDemo ? 'demo_token' : 'authToken';
        localStorage.setItem(tokenKey, JSON.stringify(token));
        setAuthData({ token });

        // Redirect based on role
        const redirectMap = {
          [Role.ADMIN]: '/admin/dashboard',
          [Role.ADVISOR]: '/advisor/dashboard',
          [Role.STUDENT]: '/student/dashboard',
        };

        navigate(redirectMap[user.role] || '/');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    }
  });

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser({ email, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    const isDemo = http.isDemoMode();
    if (isDemo) {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('demo_current_user');
      localStorage.removeItem('demo_authData');
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authData');
    }
    
    setAuthData(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setUser }}>
      {loading ? <div></div> : children}
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