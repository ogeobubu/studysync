import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { http, setAuthData } from "../api/http";
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
      const storedToken = JSON.parse(localStorage.getItem('authToken') || 'null');
      if (storedToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          setToken(storedToken);
          setAuthData({ token: storedToken });

          if (!user) {
            const response = await http.get('/users/me');
            setUser(response.data.data);
          }
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('authToken');
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
        localStorage.setItem('authToken', JSON.stringify(token));
        setAuthData({ token });

        // Redirect based on role
        const redirectMap = {
          [Role.ADMIN]: '/admin/dashboard',
          [Role.ADVISOR]: '/advisor/requests',
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('authData');
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