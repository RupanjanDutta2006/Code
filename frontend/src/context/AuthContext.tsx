import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'USER' | 'CREATOR' | 'TEACHER', fullName?: string) => Promise<void>;
  logout: () => void;
  isTeacher: boolean;
  isCreator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codevault_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<User>('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Session expired or invalid token:', err);
        localStorage.removeItem('codevault_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    const res = await api.post<{ access_token: string; user: User }>('/api/auth/login', {
      username_or_email: usernameOrEmail,
      password,
    });
    localStorage.setItem('codevault_token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
  };

  const register = async (username: string, email: string, password: string, role: 'USER' | 'CREATOR' | 'TEACHER', fullName?: string) => {
    const res = await api.post<{ access_token: string; user: User }>('/api/auth/register', {
      username,
      email,
      password,
      role,
      full_name: fullName,
    });
    localStorage.setItem('codevault_token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('codevault_token');
    setToken(null);
    setUser(null);
  };

  const isTeacher = user?.role === 'TEACHER';
  const isCreator = user?.role === 'CREATOR' || user?.role === 'TEACHER';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isTeacher, isCreator }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
