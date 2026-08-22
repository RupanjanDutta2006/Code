import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User } from '../services/api';
import { 
  auth, 
  signInWithGooglePopup, 
  signInWithGithubPopup, 
  initPhoneRecaptcha, 
  sendPhoneOtpCode, 
  logOutFromFirebase,
  FirebaseUser,
  ConfirmationResult
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'USER' | 'CREATOR' | 'TEACHER', fullName?: string) => Promise<void>;
  loginWithGoogle: (role?: 'USER' | 'TEACHER') => Promise<User>;
  loginWithGithub: (role?: 'USER' | 'TEACHER') => Promise<User>;
  sendPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, code: string, role?: 'USER' | 'TEACHER') => Promise<User>;
  logout: () => Promise<void>;
  isTeacher: boolean;
  isCreator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for deterministic integer ID from strings (e.g. Firebase UIDs)
const hashStringToInteger = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 1000 + Math.floor(Math.random() * 9000);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('codevault_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('codevault_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync user profile on mount / token change
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

  // Standard Username / Email Login
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
        provider: 'password',
        created_at: new Date().toISOString(),
      };
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('codevault_token', demoToken);
      localStorage.setItem('codevault_user', JSON.stringify(fallbackUser));
      setToken(demoToken);
      setUser(fallbackUser);
    }
  };

  // Standard Registration
  const register = async (
    username: string, 
    email: string, 
    password: string, 
    role: 'USER' | 'CREATOR' | 'TEACHER', 
    fullName?: string
  ) => {
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
        provider: 'password',
        created_at: new Date().toISOString(),
      };
      const demoToken = 'demo_token_' + Date.now();
      localStorage.setItem('codevault_token', demoToken);
      localStorage.setItem('codevault_user', JSON.stringify(fallbackUser));
      setToken(demoToken);
      setUser(fallbackUser);
    }
  };

  // Google Login / Signup
  const loginWithGoogle = async (role: 'USER' | 'TEACHER' = 'USER'): Promise<User> => {
    const fbUser = await signInWithGooglePopup();
    let loggedUser: User;
    let jwtToken = 'fb_google_' + fbUser.uid;

    try {
      const res = await api.post<{ access_token: string; user: User }>('/api/auth/firebase', {
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fbUser.displayName,
        photo_url: fbUser.photoURL,
        provider: 'google',
        role,
      });
      jwtToken = res.data.access_token;
      loggedUser = {
        ...res.data.user,
        avatar_url: fbUser.photoURL || res.data.user.avatar_url,
        provider: 'google',
      };
    } catch (err) {
      // Offline fallback
      const cleanUsername = (fbUser.displayName || fbUser.email?.split('@')[0] || `user_${fbUser.uid.slice(0, 6)}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');
      
      loggedUser = {
        id: hashStringToInteger(fbUser.uid),
        username: cleanUsername,
        email: fbUser.email || `${cleanUsername}@gmail.com`,
        role,
        full_name: fbUser.displayName || 'Google User',
        avatar_url: fbUser.photoURL || undefined,
        provider: 'google',
        created_at: new Date().toISOString(),
      };
    }

    localStorage.setItem('codevault_token', jwtToken);
    localStorage.setItem('codevault_user', JSON.stringify(loggedUser));
    setToken(jwtToken);
    setUser(loggedUser);
    return loggedUser;
  };

  // GitHub Login / Signup
  const loginWithGithub = async (role: 'USER' | 'TEACHER' = 'USER'): Promise<User> => {
    const fbUser = await signInWithGithubPopup();
    let loggedUser: User;
    let jwtToken = 'fb_github_' + fbUser.uid;

    try {
      const res = await api.post<{ access_token: string; user: User }>('/api/auth/firebase', {
        uid: fbUser.uid,
        email: fbUser.email,
        full_name: fbUser.displayName,
        photo_url: fbUser.photoURL,
        provider: 'github',
        role,
      });
      jwtToken = res.data.access_token;
      loggedUser = {
        ...res.data.user,
        avatar_url: fbUser.photoURL || res.data.user.avatar_url,
        provider: 'github',
      };
    } catch (err) {
      const cleanUsername = (fbUser.displayName || fbUser.email?.split('@')[0] || `gh_${fbUser.uid.slice(0, 6)}`)
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

      loggedUser = {
        id: hashStringToInteger(fbUser.uid),
        username: cleanUsername,
        email: fbUser.email || `${cleanUsername}@github.com`,
        role,
        full_name: fbUser.displayName || 'GitHub Developer',
        avatar_url: fbUser.photoURL || undefined,
        provider: 'github',
        created_at: new Date().toISOString(),
      };
    }

    localStorage.setItem('codevault_token', jwtToken);
    localStorage.setItem('codevault_user', JSON.stringify(loggedUser));
    setToken(jwtToken);
    setUser(loggedUser);
    return loggedUser;
  };

  // Phone / SMS OTP Request
  const sendPhoneOtp = async (phoneNumber: string, containerId: string = 'recaptcha-container'): Promise<ConfirmationResult> => {
    const verifier = initPhoneRecaptcha(containerId);
    return await sendPhoneOtpCode(phoneNumber, verifier);
  };

  // Phone / SMS OTP Verification
  const verifyPhoneOtp = async (
    confirmationResult: ConfirmationResult, 
    code: string, 
    role: 'USER' | 'TEACHER' = 'USER'
  ): Promise<User> => {
    const result = await confirmationResult.confirm(code);
    const fbUser = result.user;
    let loggedUser: User;
    let jwtToken = 'fb_phone_' + fbUser.uid;

    try {
      const res = await api.post<{ access_token: string; user: User }>('/api/auth/firebase', {
        uid: fbUser.uid,
        phone_number: fbUser.phoneNumber,
        provider: 'phone',
        role,
      });
      jwtToken = res.data.access_token;
      loggedUser = {
        ...res.data.user,
        phone_number: fbUser.phoneNumber || undefined,
        provider: 'phone',
      };
    } catch (err) {
      const phoneDigits = (fbUser.phoneNumber || '').replace(/[^0-9]/g, '');
      const phoneSuffix = phoneDigits.slice(-6) || fbUser.uid.slice(0, 6);
      const username = `mobile_${phoneSuffix}`;

      loggedUser = {
        id: hashStringToInteger(fbUser.uid),
        username,
        email: `${phoneDigits || fbUser.uid}@phone.codevault.pro`,
        role,
        full_name: fbUser.phoneNumber ? `User (${fbUser.phoneNumber})` : 'Mobile Verified User',
        phone_number: fbUser.phoneNumber || undefined,
        provider: 'phone',
        created_at: new Date().toISOString(),
      };
    }

    localStorage.setItem('codevault_token', jwtToken);
    localStorage.setItem('codevault_user', JSON.stringify(loggedUser));
    setToken(jwtToken);
    setUser(loggedUser);
    return loggedUser;
  };

  // Unified Logout
  const logout = async () => {
    try {
      await logOutFromFirebase();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    localStorage.removeItem('codevault_token');
    localStorage.removeItem('codevault_user');
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
  };

  const isTeacher = user?.role === 'TEACHER';
  const isCreator = user?.role === 'CREATOR';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithGithub,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
        isTeacher,
        isCreator,
      }}
    >
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
