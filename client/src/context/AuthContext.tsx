import { createContext, useContext, type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../api/useHttp';
import { setAuthData } from "../api/http"
import {jwtDecode} from 'jwt-decode';
import { Role } from "../types"
import type { User, AuthContextType, JwtPayload } from "../types"
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          const { id, role, name, email } = decoded;
          
          const userData = {
            id,
            name,
            email,
            role
          };

          const data = {
            token: storedToken
          }
          
          setUser(userData);
          setToken(storedToken);
          setAuthData(data)
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const { mutate: loginUser } = useHttp<{ token: string; user: User }, { email: string; password: string }>({
    url: '/auth/login',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        const { token, user } = data;
        setUser(user);
        setToken(token);
        localStorage.setItem('authToken', token);
        
        // Redirect based on role
        if (user.role === Role.ADMIN) {
          navigate('/admin/system');
        } else if (user.role === Role.ADVISOR) {
          navigate('/advisor/requests');
        } else {
          navigate('/student/dashboard');
        }
      },
      onError: (error) => {
        toast.error(error.response.data.message)
      }
    }
  });

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser({ email, password });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
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