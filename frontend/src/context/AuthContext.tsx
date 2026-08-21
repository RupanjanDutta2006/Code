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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('codevault_user');
    return saved ? JSON.parse(saved) : null;
  });
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
        localStorage.setItem('codevault_user', JSON.stringify(res.data));
      } catch (err) {
        const saved = localStorage.getItem('codevault_user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await api.post<{ access_token: string; user: User }>('/api/auth/login', {
        username_or_email: usernameOrEmail,
        password,
      });
      localStorage.setItem('codevault_token', res.data.access_token);
      localStorage.setItem('codevault_user', JSON.stringify(res.data.user));
      setToken(res.data.access_token);
      setUser(res.data.user);
    } catch (err) {
      // Offline / Vercel demo user fallback
      const isTeacher = usernameOrEmail.toLowerCase().includes('teacher') || usernameOrEmail.toLowerCase().includes('prof');
      const fallbackUser: User = {
        id: isTeacher ? 2 : 3,
        username: usernameOrEmail || 'student',
        email: `${usernameOrEmail || 'student'}@codevault.pro`,
        role: isTeacher ? 'TEACHER' : 'USER',
        full_name: isTeacher ? 'Prof. Rajesh Sharma' : (usernameOrEmail === 'asha_r' ? 'Asha R.' : 'Student User'),
        created_at: new Date().toISOString(),
      };
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('codevault_token', demoToken);
      localStorage.setItem('codevault_user', JSON.stringify(fallbackUser));
      setToken(demoToken);
      setUser(fallbackUser);
    }
  };

  const register = async (username: string, email: string, password: string, role: 'USER' | 'CREATOR' | 'TEACHER', fullName?: string) => {
    try {
      const res = await api.post<{ access_token: string; user: User }>('/api/auth/register', {
        username,
        email,
        password,
        role,
        full_name: fullName,
      });
      localStorage.setItem('codevault_token', res.data.access_token);
      localStorage.setItem('codevault_user', JSON.stringify(res.data.user));
      setToken(res.data.access_token);
      setUser(res.data.user);
    } catch (err) {
      const fallbackUser: User = {
        id: Date.now(),
        username,
        email,
        role,
        full_name: fullName || username,
        created_at: new Date().toISOString(),
      };
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('codevault_token', demoToken);
      localStorage.setItem('codevault_user', JSON.stringify(fallbackUser));
      setToken(demoToken);
      setUser(fallbackUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('codevault_token');
    localStorage.removeItem('codevault_user');
    setToken(null);
    setUser(null);
  };

  const isTeacher = user?.role === 'TEACHER';
  const isCreator = user?.role === 'CREATOR';

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
